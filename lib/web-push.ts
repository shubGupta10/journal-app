import webpush from 'web-push';

const publicKey = process.env.VAPID_PUBLIC_KEY || '';
const privateKey = process.env.VAPID_PRIVATE_KEY || '';
const subject = process.env.VAPID_SUBJECT!;

webpush.setVapidDetails(
    subject,
    publicKey,
    privateKey
);

export default webpush;