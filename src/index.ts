import { $query, $update, Record, StableBTreeMap, Vec, match, Result, nat64, ic, Opt } from 'azle';
import { v4 as uuidv4 } from 'uuid';

// Define types for DonationRecord and DonationPayload
type DonationRecord = Record<{
    id: string;
    amount: number;
    message: string;
    donorName: string;
    receiverName: string;
    createdAt: nat64;
}>

type DonationPayload = Record<{
    amount: number;
    message: string;
    donorName: string;
    receiverName: string;
}>

// Create a map to store donation records
const donationStorage = new StableBTreeMap<string, DonationRecord>(0, 44, 1024);

// Create a map to store donor and receiver names for each donation
const donationNamesStorage = new StableBTreeMap<string, { donorName: string; receiverName: string }>(0, 44, 1024);

$update;
export function makeDonation(payload: DonationPayload): Result<DonationRecord, string> {
    const record: DonationRecord = { 
        id: uuidv4(), 
        createdAt: ic.time(), 
        ...payload 
    };
    donationStorage.insert(record.id, record);
    // Store donor and receiver names
    donationNamesStorage.insert(record.id, { donorName: payload.donorName, receiverName: payload.receiverName });
    return Result.Ok(record);
}

// Function to get all donations
$query;
export function getAllDonations(): Result<Vec<DonationRecord>, string> {
    return Result.Ok(donationStorage.values());
}

// Function to get total amount donated
$query;
export function getTotalAmountDonated(): Result<number, string> {
    const donations = donationStorage.values();
    const totalAmount = donations.reduce((total, donation) => total + donation.amount, 0);
    return Result.Ok(totalAmount);
}

// Function to get recent donations
$query;
export function getRecentDonations(limit: number): Result<Vec<DonationRecord>, string> {
    const donations = donationStorage.values().reverse().slice(0, limit);
    return Result.Ok(donations);
}

// Function to get a specific donation by id
$query;
export function getDonation(id: string): Result<DonationRecord, string> {
    return match(donationStorage.get(id), {
        Some: (record) => Result.Ok(record),
        None: () => Result.Err(`Donation with id=${id} not found`)
    });
}

// Function to get donor and receiver names for a donation
$query;
export function getDonationNames(id: string): Result<{ donorName: string; receiverName: string }, string> {
    return match(donationNamesStorage.get(id), {
        Some: (names) => Result.Ok(names),
        None: () => Result.Err(`Donation names for id=${id} not found`)
    });
}

// A workaround to make the uuid package work with Azle
globalThis.crypto = {
    // @ts-ignore
    getRandomValues: () => {
        let array = new Uint8Array(32);

        for (let i = 0; i < array.length; i++) {
            array[i] = Math.floor(Math.random() * 256);
        }

        return array;
    },
};
