const AWS = require('aws-sdk');
const sharp = require('sharp');

// 람다가 알아서 유저 인증정보 절차를 진행해주기 때문에 별도로 유저정보 기입 x
const s3 = new AWS.S3();

exports.handler = async(event, context, callback) => {
  const Bucket = event.Records[0].s3.bucket.name; //react-shop
  const Key = decodeURIComponent(event.Records[0].s3.object.key); //original/123124124.png
  console.log('Bucket',Bucket);
  console.log('Key',Key);
  const filename = Key.split('/')[Key.split('/').length - 1];
  const ext = Key.split('.')[Key.split('.').length - 1].toLowerCase();
  const requiredFormat = ext === 'jpg' ? 'jpeg' : ext;
  console.log('filename', filename, 'ext', ext);

  try{
    const s3Object = await s3.getObject({Bucket, Key}).promise();
    console.log('original', s3Object.Body.length); //몇바이트인지
    const resizedImage = await sharp(s3Object.Body)
    .resize(400,400, {fit: 'inside'})
    .toFormat(requiredFormat)
    .toBuffer();

    await s3.putObject({
      Bucket,
      Key: `thumb/${filename}`,
      Body: resizedImage
    }).promise();
    console.log('put', resizedImage.length);
    return callback(null, `thumb/${filename}`);

  }
  catch(error){
    console.error(error);
    return callback(error);
  }
}