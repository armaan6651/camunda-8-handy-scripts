/*
 * Simple handy script to cancel a given set of process instances in bulk 
*/

const PROCESS_IDS_TO_CANCEL = [
    2251799944688659,
    4503599753330083,
    2251799944523819,
    4503599753333155
]

const axios = require('axios');
const https = require('https'); 

const HOST = 'https://yourhost.com';

// PROVIDER HEADERS containing auth token or sessions. 
// Trick: open operate and copy the headers from any of the api requests from the network tab
const headers = {};

async function cancelProcessInstances(processIds) {
    const url = `${HOST}/operate/api/process-instances/batch-operation`;

    const requestData = {
        operationType: 'CANCEL_PROCESS_INSTANCE',
        query: {
            active: true,
            running: true,
            incidents: true,
            ids: processIds,
            excludeIds: []
        }
    };

    try {
        const response = await axios.post(url, requestData, { headers, httpsAgent: new https.Agent({ rejectUnauthorized: false }) });
        console.log('Process instances cancelled:', response.data);
    } catch (error) {
        console.error('Error cancelling process instances:', error.response ? error.response.data : error.message);
    }
}

cancelProcessInstances(PROCESS_IDS_TO_CANCEL);