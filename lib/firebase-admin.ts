import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

const serviceAccount = {
  "type": "service_account",
  "project_id": "mall-app-196e1",
  "private_key_id": "192e4eb5e4c91bc591ca1a342c1c5db64269bce3",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC8aANQ8+wO5z7c\naF/DUCucdGqzDkQD1MJHjWTmUbX7gQfPCt/dqbEulaU8A90gUlVGfiWJRJuMQzJA\nQ85Myjf0P0QOU9juPvrBPqobv4gZUCgOP08sxEnLY8no6x5oluKo6Y+53F23lt+b\ngvwf4ujg2Ov8TayKIrbkLQhZN5kyyrJN8juAMHxmC7B/8bnl5lRAaljbjaU3OeHS\nKEKAeUrIqcgGRiTWiW2WIPkcNYSX4HSZABW2qLcIjK0lrnurcRtDRk3MFvBaY1t8\naJDHaRnKXi85aacUG6Ni+O5NsSHZ/qTtdZytFW2OYjKmiWQOU9LPd5f2eGtu5iOB\nMquRY4ItAgMBAAECggEABHELSvhFI2DOOZH4V/lm3cxcy5XVgqWcYuVxcICSorg6\n/+WIu4gJlkiO2ahZqS5ntj65EdBdPmRDJgKzNVo7EXYAW7ocThmL/cxFZFwSkE40\nc4mIi0yhVLsogmYwlFSiSUsgSUhpqS9UXC0tVm8aAFr8zTjjjWoeF6j8HmZSJUFZ\nrSohMYUpokYdhVytZfqXKi5qy7paICNcnx+JZ4x8mxuvis4hstEjfxqvOSLUKT5W\nFA3edS4RH4bbhCI5/FKNK5lO/wVUFKmF3g/QcJgzdUvUio8k8Dvv4b136GMYvhj7\nRV0piKWUGubPMFZFtM/gHAITMT5iMHkdcaBWAHPCgQKBgQDpIGB3s1ITVN7r3b9q\nubhen2Oz0hrWChYrc0xwSDouKT5vAhBkJUWyB2XsuEM74g0zD9pjoVJN9W9Wvkvm\nph+nvTbqOhrG+ft5at3LTEebFQicNigWHLiPABHEQ0EsNaZYa/OL2bNiP+t47jB3\nMdpQ086bNO5GLfoBHIrkR4x9zQKBgQDO5F0uEb0+6HSMYjSAxcgIY/QXLWFFEgzi\n3MLhHkAUkh2HVHX1jtOrnEmogW6Bspg3CD6hgXMw+JtCWyqOoiShulczy5fmGwuA\ntU1hf6oFAVdCFrHTWQCjGpoCIcy6Smr2HwNTTSaZua7hoOhpHn2pxPMvkmL4NUX0\nic7HUtO14QKBgCWy7KauwukJYns2AsxZeC0lDVR494oBW5BvNr85jt8EIGqHJOts\n85ZUh/D94zF93rCRMbnGzq54sCaQ42lLF/diK8041De1GSuLUo6bqUC06A2K3HSm\n9Fl7o2PflFx32IyX+Gx3KgELYSLPMds0np9PgSusJZQHv1QKr5M21stJAoGAX98A\nstVzjZAoWdk0HSwJaqHuvULBHUGlCQdlou3ioeWnm0tvMfASdCaDF3uK2r0Ivg+q\n/io/V8UMJS6bxOar9OmleRHx/KYxqV3aUsDW52Tcq3pawuYuXmZ4UV6aQQU1FYH/\nh31r0rZxrIpkyDlh3+atDjFWfVAqb4vgbwsZoeECgYEApvfkH3q604D856lgJnpn\ng+6oyPUA1fafuYUEl9swojUUKQSj9yNZ6Fhv3SMnKhmtDNduWolCyr0iIYyURiox\nMhfBC5O5Tn6ORMftCx+wP4HC6+t8zuQ1KBAg7R4xtAU0W/qCAITJMutsXr/yIFNd\n0LFG3srVDXAGvqgisVu3VDU=\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-6tcus@mall-app-196e1.iam.gserviceaccount.com",
  "client_id": "102276230111083606931",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-6tcus%40mall-app-196e1.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
};

if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount),
    databaseURL: "https://mall-app-196e1-default-rtdb.asia-southeast1.firebasedatabase.app"
  });
}

const db = getFirestore();
const auth = getAuth();

export { db, auth };

