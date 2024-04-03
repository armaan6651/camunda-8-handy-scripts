# camunda-8-handy-scripts

Make sure to read through the script as there have been certain assumptions. **Run at your own risk**

### 1. Move bulk process instances from a particular node to another node in the workflow
 * Move all process from specified node type and id to a specified node
 * This is helpful to retrigger bulk flows or in general move bulk process into a different bpmn node
 * eg: consider flow: book ticket -> send email -> complete ticket booking -> done
 * In this case consider there is an issue with send email and all process are stuck in that state. 
 * This script will be helful to bulk prcess all those process sitting in send email to be sent to compelete ticket booking

| Input | Description | Example |
| ----------- | ----------- | ----------- |
| HOST | Operate hostname | https://yourhost.com |
| HEADERS | API headers containing auth info | ```{'Cookie': 'OPERATE-SESSION=XXXXXXXXXX'}``` |
| NODE_FROM_TYPE | Type Node to move from | SERVICE_TASK |
| NODE_FROM_ID | Node ID to move from. Can be foudn in the bpmn | Activity_xxxxxx |
| NODE_TO_ID | Node ID to move to. Can be foudn in the bpmn | EventXXX |


### 2. Cancel given set of process instances in single bulk request
| Input | Description | Example |
| ----------- | ----------- | ----------- |
| HOST | Operate hostname | https://yourhost.com |
| HEADERS | API headers containing auth info | ```{'Cookie': 'OPERATE-SESSION=XXXXXXXXXX'}``` |
| PROCESS_IDS_TO_CANCEL | List of process id's to cancel | ```[ 2251799944688659, 4503599753330083, 2251799944523819, 4503599753333155 ]``` |
