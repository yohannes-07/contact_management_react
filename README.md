# Notifications API

Notifications API lets you connect ICONIK, DATACORE, and OBJECT MATRIX with your workflow.
- Choose from avialable processors such as Facial Recognition to automate your media files processing.
- Support for multiple buckets processing
- Support for webhooks for real-time updates to the workflows.
  
## How it works

Notifications API is an independent module which you can integrate your workflows for automated updates:

- Establishes connections to ICONIK, DATACORE, and OBJECT MATRIX .
- ### ICONIK
  - When a new video gets uploaded, ICONIK sends message to SQS queue(from Amazon).
  - `getQueueMessage` gets triggered every 1 minute to check if there are messages in SQS.
  - If there's a message in SQS, it retrieves an Asset from ICONIC Collections and enqueue the Asset to be processed.
  - Allocates chosen processor (eg., Facial Recognition) and passes specifc config data for the chosen processor.
  - Processes the Asset(eg., does  Facial Recognition) and update the process and the Asset status.
  - Perform cleanup operations: resource releasing.
- ### DATACORE
  - It retrieves all BucketItems with a status of "Processing" and "Pending" from the database.
  - For each BucketItem, if its status is "Processing", it updates its status to "Pending" and enqueue the item to be processed.
  - It retrieves all active S3Buckets and shedule them by creating BucketItem with status of "Pending" to be processed with `add_scheduler` function.
  - Allocates chosen processor (eg., Facial Recognition) and passes specifc config data for the chosen processor.
  - Processes the BucketItem(eg., does  Facial Recognition) and update the process and the BucketItem status.
  - Perform cleanup operations: resource releasing.
- ### OBJECT MATRIX
  - It retrieves all OMBucketItems with a status of "Processing" and "Pending" from the database.
  - For each OMBucketItem, if its status is "Processing", it updates its status to "Pending" and enqueue the item to be processed.
  - It retrieves all active OMS3Buckets and shedule them by creating BucketItem with status of "Pending" to be processed with `add_scheduler` function.
  - Allocates chosen processor (eg., Facial Recognition) and passes specifc config data for the chosen processor.
  - Processes the OMBucketItem(eg., does  Facial Recognition) and update the process and the OMBucketItem status.
  - Perform cleanup operations: resource releasing.
## Examples

| PDF                                                                   | Type        | Marker                                                                                                 | Nougat                                                                                                 |
|-----------------------------------------------------------------------|-------------|--------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------|
| [Think Python](https://greenteapress.com/thinkpython/thinkpython.pdf) | Textbook    | [View](https://github.com/VikParuchuri/marker/blob/master/data/examples/marker/thinkpython.md)         | [View](https://github.com/VikParuchuri/marker/blob/master/data/examples/nougat/thinkpython.md)         |
| [Think OS](https://greenteapress.com/thinkos/thinkos.pdf)             | Textbook    | [View](https://github.com/VikParuchuri/marker/blob/master/data/examples/marker/thinkos.md)             | [View](https://github.com/VikParuchuri/marker/blob/master/data/examples/nougat/thinkos.md)             |
| [Switch Transformers](https://arxiv.org/pdf/2101.03961.pdf)           | arXiv paper | [View](https://github.com/VikParuchuri/marker/blob/master/data/examples/marker/switch_transformers.md) | [View](https://github.com/VikParuchuri/marker/blob/master/data/examples/nougat/switch_transformers.md) |
| [Multi-column CNN](https://arxiv.org/pdf/1804.07821.pdf)              | arXiv paper | [View](https://github.com/VikParuchuri/marker/blob/master/data/examples/marker/multicolcnn.md)         | [View](https://github.com/VikParuchuri/marker/blob/master/data/examples/nougat/multicolcnn.md)         |



# Installation
##
<tab><tab>code/pip install -r requirements.txt


# Usage

First, some configuration.  Note that settings can be overridden with env vars, or in a `local.env` file in the root `marker` folder.

- Your torch device will be automatically detected, but you can manually set it also.  For example, `TORCH_DEVICE=cuda` or `TORCH_DEVICE=mps`. `cpu` is the default.
  - If using GPU, set `INFERENCE_RAM` to your GPU VRAM (per GPU).  For example, if you have 16 GB of VRAM, set `INFERENCE_RAM=16`.
  - Depending on your document types, marker's average memory usage per task can vary slightly.  You can configure `VRAM_PER_TASK` to adjust this if you notice tasks failing with GPU out of memory errors.
- Inspect the other settings in `marker/settings.py`.  You can override any settings in the `local.env` file, or by setting environment variables.
  - By default, the final editor model is off.  Turn it on with `ENABLE_EDITOR_MODEL=true`.
  - By default, marker will use ocrmypdf for OCR, which is slower than base tesseract, but higher quality.  You can change this with the `OCR_ENGINE` setting.

## Convert a single file

Run `convert_single.py`, like this:

```
python convert_single.py /path/to/file.pdf /path/to/output.md --parallel_factor 2 --max_pages 10
```

- `--parallel_factor` is how much to increase batch size and parallel OCR workers by.  Higher numbers will take more VRAM and CPU, but process faster.  Set to 1 by default.
- `--max_pages` is the maximum number of pages to process.  Omit this to convert the entire document.

Make sure the `DEFAULT_LANG` setting is set appropriately for your document.

## Convert multiple files

Run `convert.py`, like this:

```
python convert.py /path/to/input/folder /path/to/output/folder --workers 10 --max 10 --metadata_file /path/to/metadata.json --min_length 10000
```

- `--workers` is the number of pdfs to convert at once.  This is set to 1 by default, but you can increase it to increase throughput, at the cost of more CPU/GPU usage. Parallelism will not increase beyond `INFERENCE_RAM / VRAM_PER_TASK` if you're using GPU.
- `--max` is the maximum number of pdfs to convert.  Omit this to convert all pdfs in the folder.
- `--metadata_file` is an optional path to a json file with metadata about the pdfs.  If you provide it, it will be used to set the language for each pdf.  If not, `DEFAULT_LANG` will be used. The format is:
- `--min_length` is the minimum number of characters that need to be extracted from a pdf before it will be considered for processing.  If you're processing a lot of pdfs, I recommend setting this to avoid OCRing pdfs that are mostly images. (slows everything down)

```
{
  "pdf1.pdf": {"language": "English"},
  "pdf2.pdf": {"language": "Spanish"},
  ...
}
```

## Convert multiple files on multiple GPUs

Run `chunk_convert.sh`, like this:

```
MIN_LENGTH=10000 METADATA_FILE=../pdf_meta.json NUM_DEVICES=4 NUM_WORKERS=15 bash chunk_convert.sh ../pdf_in ../md_out
```

- `METADATA_FILE` is an optional path to a json file with metadata about the pdfs.  See above for the format.
- `NUM_DEVICES` is the number of GPUs to use.  Should be `2` or greater.
- `NUM_WORKERS` is the number of parallel processes to run on each GPU.  Per-GPU parallelism will not increase beyond `INFERENCE_RAM / VRAM_PER_TASK`.
- `MIN_LENGTH` is the minimum number of characters that need to be extracted from a pdf before it will be considered for processing.  If you're processing a lot of pdfs, I recommend setting this to avoid OCRing pdfs that are mostly images. (slows everything down)

Note that the env variables above are specific to this script, and cannot be set in `local.env`.

# Benchmarks

Benchmarking PDF extraction quality is hard.  I've created a test set by finding books and scientific papers that have a pdf version and a latex source.  I convert the latex to text, and compare the reference to the output of text extraction methods.

Benchmarks show that marker is 10x faster than nougat, and more accurate outside arXiv (nougat was trained on arXiv data).  We show naive text extraction (pulling text out of the pdf with no processing) for comparison.

**Speed**

| Method | Average Score | Time per page | Time per document |
|--------|---------------|---------------|-------------------|
| naive  | 0.350727      | 0.00152378    | 0.326524          |
| marker | 0.641062      | 0.360622      | 77.2762           |
| nougat | 0.629211      | 3.77259       | 808.413           |

**Accuracy**

First 3 are non-arXiv books, last 3 are arXiv papers.

| Method | switch_trans.pdf | crowd.pdf | multicolcnn.pdf | thinkos.pdf | thinkdsp.pdf | thinkpython.pdf |
|--------|------------------|-----------|-----------------|-------------|--------------|-----------------|
| naive  | 0.244114         | 0.140669  | 0.0868221       | 0.366856    | 0.412521     | 0.468281        |
| marker | 0.482091         | 0.466882  | 0.537062        | 0.754347    | 0.78825      | 0.779536        |
| nougat | 0.696458         | 0.552337  | 0.735099        | 0.655002    | 0.645704     | 0.650282        |

Peak GPU memory usage during the benchmark is `3.3GB` for nougat, and `3.1GB` for marker.  Benchmarks were run on an A6000.

**Throughput**

Marker takes about 2GB of VRAM on average per task, so you can convert 24 documents in parallel on an A6000.

![Benchmark results](data/images/per_doc.png)

## Running your own benchmarks

You can benchmark the performance of marker on your machine.  First, download the benchmark data [here](https://drive.google.com/file/d/1WiN4K2-jQfwyQMe4wSSurbpz3hxo2fG9/view?usp=drive_link) and unzip.

Then run `benchmark.py` like this:

```
python benchmark.py data/pdfs data/references report.json --nougat
```

This will benchmark marker against other text extraction methods.  It sets up batch sizes for nougat and marker to use a similar amount of GPU RAM for each.

Omit `--nougat` to exclude nougat from the benchmark.  I don't recommend running nougat on CPU, since it is very slow.

