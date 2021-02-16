import { SecretManagerServiceClient } from '@google-cloud/secret-manager';

const client = new SecretManagerServiceClient({
    credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY,
    }
});

export const getSecret = async (name: string, toJson: boolean = true) => {
    const [ secret ] = await client.accessSecretVersion({ name });
    const payload = secret.payload.data.toString();
    if (toJson) return JSON.parse(payload);
    else return payload;
}