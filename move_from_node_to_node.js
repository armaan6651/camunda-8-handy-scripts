/*
 * Move all process from specified node type and id to a specified node
 * This is helpful to retrigger bulk flows or in general move bulk process into a different bpmn node
 * eg: consider flow: book ticket -> send email -> complete ticket booking -> done
 * In this case consider there is an issue with send email and all process are stuck in that state. 
 * This script will be helful to bulk prcess all those process sitting in send email to be sent to compelete ticket booking
 */

const axios = require('axios');
const https = require('https');

const NODE_FROM_TYPE = 'SERVICE_TASK';
const NODE_FROM_ID = 'Activity_xxxxxx';
const NODE_TO_ID = 'EventXXX';
const HOST = 'https://yourhost.com';

// PROVIDER HEADERS containing auth token or sessions. 
// Trick: open operate and copy the headers from any of the api requests from the network tab
const HEADERS = {};

// provide processinstances to be processed
// Trick: filter the process using operate and copy the network result to get a list of processInstances or do it manually :)
const data = {
    "processInstances": [{
        "id": "4503599820759756"
    }]
};

// Function to extract the id of the node with type NODE_FROM_TYPE and state "ACTIVE"
function extractActiveNode(response, processId) {
    const processInstance = response[processId];
    if (!processInstance) {
        console.log('Process instance not found in response');
        return null;
    }

    const children = processInstance.children;
    if (!children) {
        console.log('Children not found in process instance');
        return null;
    }

    for (const child of children) {
        if (child.type === NODE_FROM_TYPE && child.state === 'ACTIVE' && child.flowNodeId === NODE_FROM_ID) {
            console.log('Active node ID:', child.id);
            return child.id;
        }
    }

    console.warn('Active node not found in response');
}

// Get flow node id which needs to be retriggered and modify instance
async function fetchData(processId) {
    try {
        const agent = new https.Agent({
            rejectUnauthorized: false
        });
        const response = await axios.post(`${HOST}/operate/api/flow-node-instances`, {
            queries: [{
                processInstanceId: processId,
                treePath: processId,
                pageSize: 50
            }]
        }, {
            HEADERS,
            httpsAgent: agent
        });

        const activeId = await extractActiveNode(response.data, processId);
        if (activeId != null) {
            await modifyInstance(processId, activeId)
            console.log('Instance modifed', processId);
        }
    } catch (error) {
        console.error('Error fetching data1:');
    }
}

// move instance from flow node to flow node
async function modifyInstance(processId, nodeId) {
    try {
        const agent = new https.Agent({
            rejectUnauthorized: false
        });
        const response = await axios.post(`${HOST}/operate/api/process-instances/${processId}/modify`, {
            "modifications": [{
                "modification": "MOVE_TOKEN",
                "fromFlowNodeInstanceKey": nodeId,
                "toFlowNodeId": NODE_TO_ID,
                "newTokensCount": 1
            }]
        }, {
            HEADERS,
            httpsAgent: agent
        });
    } catch (error) {
        console.error('Error fetching data:');
    }
}

const timer = ms => new Promise(res => setTimeout(res, ms))

// Read the JSON values
async function run() {
    const instances = data.processInstances;

    console.log('++++++++++++++++++++++++++ Armaan`s script starts ++++++++++++++++++++++++++')
    for (let i = 0; i < instances.length; i++) {
        const processId = instances[i].id;
        // Push the processId into the processIds array
        console.log('ProcessId', processId);
        await fetchData(processId);

        // time delay to prevent hitting request limit
        await timer(500);
    }
    console.log('-------------------------- Armaan`s script instance ends --------------------------')
}

// to run bulk!!!!!
run();

// to run individual
// fetchData(9007199447256064);