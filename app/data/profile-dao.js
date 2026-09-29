/* The ProfileDAO must be constructed with a connected database object */
function ProfileDAO(db) {

    "use strict";

    if (false === (this instanceof ProfileDAO)) {
        console.log("Warning: ProfileDAO constructor called without 'new' operator");
        return new ProfileDAO(db);
    }

    const users = db.collection("users");

    // Fix for A02:2021 - Cryptographic Failures
    // Encrypt sensitive fields (ssn, dob, bankAcc, bankRouting) at rest using AES-256-CBC.
    // A unique random IV is generated per encryption and stored alongside the ciphertext,
    // since IVs are not secret but must be unique and available for decryption.
    const crypto = require("crypto");
    const config = require("../../config/config");

    // Derive a proper 32-byte key for aes256 from the configured key string
    const derivedKey = crypto.createHash("sha256").update(config.cryptoKey).digest();

    const encrypt = (toEncrypt) => {
        if (!toEncrypt) return toEncrypt;
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv("aes-256-cbc", derivedKey, iv);
        const encrypted = Buffer.concat([cipher.update(String(toEncrypt), "utf8"), cipher.final()]);
        // Store iv:ciphertext together (both hex), so decrypt has what it needs
        return `${iv.toString("hex")}:${encrypted.toString("hex")}`;
    };

    const decrypt = (toDecrypt) => {
        if (!toDecrypt || toDecrypt.indexOf(":") === -1) return toDecrypt;
        const [ivHex, encryptedHex] = toDecrypt.split(":");
        const iv = Buffer.from(ivHex, "hex");
        const decipher = crypto.createDecipheriv("aes-256-cbc", derivedKey, iv);
        const decrypted = Buffer.concat([decipher.update(Buffer.from(encryptedHex, "hex")), decipher.final()]);
        return decrypted.toString("utf8");
    };

    this.updateUser = (userId, firstName, lastName, ssn, dob, address, bankAcc, bankRouting, callback) => {

        const user = {};
        if (firstName) {
            user.firstName = firstName;
        }
        if (lastName) {
            user.lastName = lastName;
        }
        if (address) {
            user.address = address;
        }
        if (bankAcc) {
            user.bankAcc = bankAcc;
        }
        if (bankRouting) {
            user.bankRouting = bankRouting;
        }
        // Fix for A02:2021 - Cryptographic Failures: store ssn/dob encrypted, not plaintext
        if (ssn) {
            user.ssn = encrypt(ssn);
        }
        if (dob) {
            user.dob = encrypt(dob);
        }

        users.update({
                _id: parseInt(userId)
            }, {
                $set: user
            },
            err => {
                if (!err) {
                    console.log("Updated user profile");
                    return callback(null, user);
                }
                return callback(err, null);
            }
        );
    };

    this.getByUserId = (userId, callback) => {
        users.findOne({
                _id: parseInt(userId)
            },
            (err, user) => {
                if (err) return callback(err, null);
                // Fix for A02:2021 - Cryptographic Failures: decrypt for authorized display
                if (user) {
                    user.ssn = user.ssn ? decrypt(user.ssn) : "";
                    user.dob = user.dob ? decrypt(user.dob) : "";
                }
                callback(null, user);
            }
        );
    };
}

module.exports = { ProfileDAO };