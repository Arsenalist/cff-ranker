function validateFileIsProvided(req) {
    return req.files && Object.keys(req.files).length !== 0;
}


async function handleUpload(req, fileInputName) {
    if (!validateFileIsProvided(req)) {
        throw new Error("No file provided")
    }
    return await moveFileToDisk(req.files[fileInputName])
}

async function moveFileToDisk(file) {
    const filePathOnDisk = './' + file.name
    await file.mv(filePathOnDisk, function(err) {
        if (err) {
            throw new Error("Could not store file " + err)
        }
    })
    return filePathOnDisk
}

export { handleUpload }
