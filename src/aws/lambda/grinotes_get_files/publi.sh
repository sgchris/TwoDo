rm index.zip 
cd lambda 
zip -X -r ../index.zip *
cd .. 
aws lambda update-function-code --function-name grinotes_get_files --zip-file fileb://index.zip
