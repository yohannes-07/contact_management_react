# Notifications API

Notifications API lets you connect ICONIK, DATACORE, and OBJECT MATRIX with your workflow.
- Choose from avialable processors such as Facial Recognition to automate your media files processing.
- Support for multiple buckets processing.
- Support for webhooks for real-time updates.
  
## How it works

Notifications API is an independent module which you can integrate your workflows for automated updates:

- Establishes connections to ` ICONIK `, ` DATACORE `, and ` OBJECT MATRIX `.
- ### ICONIK
  - When a new video gets uploaded, ICONIK sends message to SQS queue(from Amazon).
  - ` getQueueMessage ` gets triggered every 1 minute to check if there are messages in SQS.
  - If there's a message in SQS, it retrieves an Asset from ICONIC Collections and enqueue the Asset to be processed.
  - Allocates chosen processor (eg., Facial Recognition) and passes specifc config data for the chosen processor.
  - Processes the Asset(eg., does  Facial Recognition) and update the process and the Asset status.
  - Perform cleanup operations: resource releasing.
- ### DATACORE
  - It retrieves all BucketItems with a status of "Processing" and "Pending" from the database.
  - For each BucketItem, if its status is "Processing", it updates its status to "Pending" and enqueue the item to be processed.
  - It retrieves all active S3Buckets and shedule them by creating BucketItem with status of "Pending" to be processed with ` add_scheduler ` function.
  - Allocates chosen processor (eg., Facial Recognition) and passes specifc config data for the chosen processor.
  - Processes the BucketItem(eg., does  Facial Recognition) and update the process and the BucketItem status.
  - Perform cleanup operations: resource releasing.
- ### OBJECT MATRIX
  - It retrieves all OMBucketItems with a status of "Processing" and "Pending" from the database.
  - For each OMBucketItem, if its status is "Processing", it updates its status to "Pending" and enqueue the item to be processed.
  - It retrieves all active OMS3Buckets and shedule them by creating BucketItem with status of "Pending" to be processed with ` add_scheduler ` function.
  - Allocates chosen processor (eg., Facial Recognition) and passes specifc config data for the chosen processor.
  - Processes the OMBucketItem(eg., does  Facial Recognition) and update the process and the OMBucketItem status.
  - Perform cleanup operations: resource releasing.
## Examples



# Installation
  ```bash
  git clone git@github.com:StartupAgile-WIN/NotificationAPI.git
  ```
  ```bash
  cd NotificationAPI
  ```
   #### Linux and MAC
   ```bash
   python3 -m venv venv
   ```
   ```bash
   source venv/bin/activate
   ```
   ```bash
   pip3 install -r requirements.txt
   ```
   ```bash
   python3 main.py
   ```
  #### WINDOWS
  ```bash
  python -m venv venv
  ```
  ```bash
  source venv\Scripts\activate
  ```
  ```bash
  pip install -r requirements.txt
  ```
  ```bash
  python main.py
  ```

 # Usage 
 
## Environment Configuration

This Portion provides details for each environment variable used in the `.env` file. These variables are crucial for configuring various aspects of the system and services it interacts with. Do not share the `.env` file or disclose its contents as it contains sensitive access credentials.

``for easy access you can look at .env.examples``

### AWS Configuration

- `AWS_ACCESS_KEY`: The access key for your AWS (Amazon Web Services) account which provides programmatic access to AWS services.
- `AWS_SECRET_KEY`: The secret key paired with the access key for enhanced security. This should be kept confidential.

### DataCore Settings

- `DATACORE_ENDPOINT`: The API endpoint for DataCore services. It allows the application to interact with DataCore's cloud-based services.
- `DATACORE_TOKEN`: Authentication token used to validate the application's requests to the DataCore API.

### Application Logging

- `LOG_LEVEL`: Determines the level of verbosity for the application logs. "ALL" will log every level of detail, from debug messages to errors.

### Iconik Settings

- `ICONIK_APP_ID`: The application ID specific to the Iconik service. It uniquely identifies your application in the Iconik ecosystem.
- `ICONIK_ACCESS_TOKEN`: A security token for authenticating API requests to the Iconik service. This token provides authorization to perform actions within Iconik under the application's context.

- `DATABASE_HOST`: The hostname where the database server is running, usually a URL or IP address.
- `DATABASE_PORT`: The port on which the database server is listening for connections.
- `DATABASE_USER`: The username used to connect to the database.
- `DATABASE_PASSWORD`: The password for the database user. This should be kept secure and not shared.
- `DATABASE_NAME`: The name of the database to which the application should connect.

### copy the link below to configure the api rule.
```bash 
http://${host}:${port}/docs
```
## Automated Workflow Configuration

To automate your workflow, you can configure the `config.json` file. Below is an example of the configuration options:

```json
{
  "system": ["iconik", "datacore"],
  "system_endpoint": "https://2fcgx73pvkbljznby7bptqeegy0rredo.lambda-url.us-east-2.on.aws/",
  "iconik_url": "https://preview.iconik.cloud",
  "datacore_endpoint": "https://win-demo.cloud.datacore.com",
  "sqs_queue_url": "https://sqs.us-east-2.amazonaws.com/957693358930/Webhook-Requeue",
  "aws_region": "us-east-2",
  "single_webhook": true,
  "webhook_name": "Notification API Webhook",
  "processor": "FacialRecognition",
  "temp_folder": "temp_files",
  "no_of_threads": 1,
  "video_file_types": [
    "video/mp4",
    "video/x-msvideo",
    "video/quicktime",
    "video/x-matroska",
    "video/x-ms-wmv",
    "video/x-flv",
    "video/webm",
    "video/mpeg",
    "video/mpeg",
    "video/x-m4v",
    "video/3gpp",
    "video/3gpp2",
    "video/mpeg",
    "video/ogg"
  ],
  "audio_file_types": [],
  "image_file_types": []
}
```
- **Processor**: Choose the desired processor for your workflow. Options include `FacialRecognition`, `AutoTranslation`, and `ObjectDetection`.

- **Number of Threads**: Increasing the number of threads to improve processing speed.
  
- **Single Webhook**: Set to true if you want to use a single webhook.

- **Webhook Name**: The name of the webhook.

- **Temporary Folder**: The folder where temporary files are stored.


# API ENDPOINTS
These endpoints allows you to interact with your chosen processor and media storage company.

### POST /datacore/s3-bucket  Add S3 Bucket
  ```
      {
        "bucket": "mybucket",
        "path": "datacore/mybucket",
        "status": "Active",
        "cron": ""0 0 * * *"",
        "config": {
                    'diarization': 'demo_1',
                    'keep_original_audio': False,
                    'model': 'base',
                    'language': None,
                    'target_language': 'english',
                    'translation_level': 'l1',
                    'tts': 'open-voice'
                  },
        "first_time": true,
        "last_scan": "",
        "job_id": "s3-job-123"
      }
  ```
  Config for FaceRecognition
  ```
        {
          'asset_id': 'asset_id',
          'model': 'VGG-Face',
          'backend': 'opencv',
          'frame_difference': 15,
          'identification_treshold': 1.2,
          'action': 'process',
        }
  ```
  Config for ObjectDetection
  ```
        {
          'items': [],
          'detection_model': 'yolov8',
          'frame_difference': 15,
          'box_treshold': 0.5,
          'text_treshold': 0.5,
        }
  ```


**Parameters**

|          Name | Required |   Type  | Description                                                                                                                                                         |
| -------------:|:--------:|:-------:| ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|     `bucket` | required | string  | The name of the bucket you want to process.                                                                   |
|     `path`   | required | string  | The path where the  bucket is stored inside datacore.  |
|     `status` | optional | string  | Status of the bucket object. Options include "Pending", "Processing"|
|     `cron`   | optional | string  | Interval, specifc date... you want to trigger to check the datacore |
|     `config` | optional | dict    | Processor configurations you want to pass. Options include "AutoTranslation", "FacialRecognition", "ObjectDetection"   |
| `first_time` | optional | bool    | Is the bucket being processed for the first time? | 
|  `last_time` | optional | string  | When was the bucket last time processed? | 
|     `job_id` | optional | bool    | Unique identifier for the task | 

**Responses**

  ***Success***
  ```
    {"message": f"S3 Bucket added", 'data': s3_bucket}
  ```

  ***Errors***
  ```
   {
    "detail": [
      {
        "loc": [
          "string",
          0
        ],
        "msg": "Invalid cron expression",
        "type": "string"
        }
      ]
    }
  }
  ```

___

### POST /iconik/collection  Add Collection

  ```
    {
      "collection_id": "iconic/collections/myCollection",
      "status": "Active",
      "config": {

                },
      "first_time": true
    }
  ```



**Parameters**

|          Name | Required |   Type  | Description                                                                                                                                                         |
| -------------:|:--------:|:-------:| ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `collecton_id` | required | string  | The name of the bucket you want to process.                                                                   |
|     `status` | optional | string  | Status of the bucket object. Options include "Pending", "Processing"|
|     `config` | optional | dict    | Processor configurations you want to pass. Options include "AutoTranslation", "FacialRecognition", "ObjectDetection"   |
| `first_time` | optional | bool    | Is the bucket being processed for the first time? | 

**Responses**

  ***Success***
  ```
    {"message": f"Collection added", 'data': collection}
  ```

  ***Errors***
  ```
   {
    "detail": [
      {
        "loc": [
          "string",
          0
        ],
        "msg": "Invalid cron expression",
        "type": "string"
        }
      ]
    }
  }
  ```
___

### POST /object-matrix/s3-bucket  Add S3 Bucket
  ```
      {
        "bucket": "myOMbucket",
        "path": "objectMatrix/mybucket",
        "status": "Active",
        "cron": ""0 0 * * *"",
        "config": {
                    'diarization': 'demo_1',
                    'keep_original_audio': False,
                    'model': 'base',
                    'language': None,
                    'target_language': 'english',
                    'translation_level': 'l1',
                    'tts': 'open-voice'
                  },
        "first_time": true,
        "last_scan": "",
        "job_id": "s3-job-123"
      }
  ```



**Parameters**

|          Name | Required |   Type  | Description                                                                                                                                                         |
| -------------:|:--------:|:-------:| ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|     `bucket` | required | string  | The name of the bucket you want to process.                                                                   |
|     `path`   | required | string  | The path where the  bucket is stored inside datacore.  |
|     `status` | optional | string  | Status of the bucket object. Options include "Pending", "Processing"|
|     `cron`   | optional | string  | Interval, specifc date... you want to trigger to check the datacore |
|     `config` | optional | dict    | Processor configurations you want to pass. Options include "AutoTranslation", "FacialRecognition", "ObjectDetection"   |
| `first_time` | optional | bool    | Is the bucket being processed for the first time? | 
|  `last_time` | optional | string  | When was the bucket last time processed? | 
|     `job_id` | optional | bool    | Unique identifier for the task | 

**Responses**

  ***Success***
  ```
    {"message": f"S3 OMBucket added", 'data': s3_bucket}
  ```

  ***Errors***
  ```
   {
    "detail": [
      {
        "loc": [
          "string",
          0
        ],
        "msg": "Invalid cron expression",
        "type": "string"
        }
      ]
    }
  }
  ```

