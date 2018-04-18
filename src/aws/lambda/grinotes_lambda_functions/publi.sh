rm index.zip
cd lambda
zip -X -r ../index.zip *
cd ..
aws lambda update-function-code --function-name grinotes_get_files --zip-file fileb://index.zip
aws lambda update-function-code --function-name grinotes_add_file --zip-file fileb://index.zip
aws lambda update-function-code --function-name grinotes_delete_file --zip-file fileb://index.zip
aws lambda update-function-code --function-name grinotes_get_file --zip-file fileb://index.zip
aws lambda update-function-code --function-name grinotes_save_file --zip-file fileb://index.zip
aws lambda update-function-code --function-name grinotes_get_metadata --zip-file fileb://index.zip
aws lambda update-function-code --function-name grinotes_set_metadata --zip-file fileb://index.zip
