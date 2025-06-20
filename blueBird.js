var blueBird = new require('redbird')({
    port: 80,


    ssl: {
        port: 443,
        key: "./certificates/pr.key",
        cert: "./certificates/localcrypto_cloud.crt",
        ca: "./certificates/localcrypto_cloud.ca-bundle"
    }
});


// Since we will only have one https host, we dont need to specify additional certificates.
blueBird.register('localcrypto.cloud', 'https://localhost:3005', {ssl: true});