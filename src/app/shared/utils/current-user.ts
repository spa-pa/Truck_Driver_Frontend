import { GlobalConfig } from "@shared/configs/global-config";
import { EncryptedStorage } from "./encrypted-storage";

export const currentUser = () => {
    return JSON.parse(
        new EncryptedStorage().getItem(new GlobalConfig().userDetails)!
    );
};

export const currentCustomerId = () => {
    return JSON.parse(
        new EncryptedStorage().getItem(new GlobalConfig().customerId)!
    );};

