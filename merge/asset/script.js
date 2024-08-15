const APP_TOKEN = '8d1cc2ad-e097-4b86-90ef-7a27e19fb833';
const PROMO_ID = 'dc128d28-c45b-411c-98ff-ac7726fbaea4';
const EVENTS_DELAY = 20000;

document.getElementById('startBtn').addEventListener('click', async () => {
    const startBtn = document.getElementById('startBtn');
    const progressContainer = document.getElementById('progressContainer');
    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText');
    const keyContainer = document.getElementById('keyContainer');
    const keysList = document.getElementById('keysList');
    const keyCount = parseInt(document.getElementById('keyCountSelect').value);

    // Reset UI for new generation
    progressBar.style.width = '0%';
    progressText.innerText = '0%';
    progressContainer.classList.remove('hidden');
    keyContainer.classList.add('hidden');
    keysList.innerHTML = ''; // Очищаем список ключей перед новой генерацией

    startBtn.disabled = true;

    let progress = 0;
    const updateProgress = (increment) => {
        progress += increment;
        progressBar.style.width = `${progress}%`;
        progressText.innerText = `${progress}%`;
    };

    const generateKeyProcess = async () => {
        const clientId = generateClientId();
        let clientToken;
        try {
            clientToken = await login(clientId);
        } catch (error) {
            alert(`Login failed: ${error.message}`);
            startBtn.disabled = false;
            return;
        }

        for (let i = 0; i < 7; i++) {
            await sleep(EVENTS_DELAY * delayRandom());
            const hasCode = await emulateProgress(clientToken);
            updateProgress(10 / keyCount); // Update progress incrementally
            if (hasCode) {
                break;
            }
        }

        try {
            const key = await generateKey(clientToken);
            updateProgress(30 / keyCount); // Finalize progress
            return key;
        } catch (error) {
            alert(`Key generation failed: ${error.message}`);
            return null;
        }
    };

    const keys = await Promise.all(Array.from({ length: keyCount }, generateKeyProcess));

    keys.filter(key => key).forEach((key, index) => {
        const keyItem = document.createElement('div');
        keyItem.classList.add('key-item');

        const keyText = document.createElement('p');
        keyText.innerText = key;
        keyText.id = `key-${index}`;

        const copyBtn = document.createElement('button');
        copyBtn.innerText = 'Копировать';
        copyBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(key).then(() => {
                alert(`Ключ ${index + 1} скопирован: ${key}`);
            }).catch(err => {
                console.error('Ошибка копирования: ', err);
            });
        });

        keyItem.appendChild(keyText);
        keyItem.appendChild(copyBtn);
        keysList.appendChild(keyItem);
    });

    keyContainer.classList.remove('hidden');
    startBtn.disabled = false;
});

function generateClientId() {
    const timestamp = Date.now();
    const randomNumbers = Array.from({ length: 19 }, () => Math.floor(Math.random() * 10)).join('');
    return `${timestamp}-${randomNumbers}`;
}

async function login(clientId) {
    const response = await fetch('https://api.gamepromo.io/promo/login-client', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ appToken: APP_TOKEN, clientId, clientOrigin: 'deviceid' })
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Failed to login');
    }
    return data.clientToken;
}

async function emulateProgress(clientToken) {
    const response = await fetch('https://api.gamepromo.io/promo/register-event', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${clientToken}`
        },
        body: JSON.stringify({
            promoId: PROMO_ID,
            eventId: crypto.randomUUID(),
            eventOrigin: 'undefined'
        })
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Failed to register event');
    }
    return data.hasCode;
}

async function generateKey(clientToken) {
    const response = await fetch('https://api.gamepromo.io/promo/create-code', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${clientToken}`
        },
        body: JSON.stringify({ promoId: PROMO_ID })
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Failed to generate key');
    }
    return data.promoCode;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function delayRandom() {
    return Math.random() / 3 + 1;
}
