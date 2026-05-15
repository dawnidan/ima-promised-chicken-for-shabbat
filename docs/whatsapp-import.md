# WhatsApp Import

## Current support

The importer can now parse exported WhatsApp `.txt` files and classify candidate messages as:

- `url`
- `recipe_text`
- `attachment`

## Usage

```bash
npm run import:whatsapp -- path/to/chat-1.txt path/to/chat-2.txt
```

The script writes candidate records to:

```text
server/whatsappImportedCandidates.json
```

## Next cleanup stage

After import, the next step is to:

1. review noisy candidates
2. transcribe useful audio attachments
3. run OCR on useful recipe images
4. normalize the cleaned recipes into a canonical recipe format
5. upload the cleaned corpus into the vector store
