import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as AWS from 'aws-sdk';

@Injectable()
export class AwsS3Service {
  private s3: AWS.S3;

  constructor() {
    this.s3 = new AWS.S3({
      accessKeyId: process.env.NEXTLENSE_AWS_ACCESS_KEY,
      secretAccessKey: process.env.NEXTLENSE_AWS_SECRET_KEY,
      region: process.env.NEXTLENSE_AWS_REGION,
    });
  }

  async uploadImage(
    file: Express.Multer.File,
    filename: string,
    mimetype: string,
    hashedUser: string,
  ): Promise<string> {
    try {
      const folderPath = `${hashedUser}/`;
      const newFilename = `${Date.now()}-${filename}`;
      const params = {
        Bucket: process.env.NEXTLENSE_AWS_BUCKET_NAME,
        Key: folderPath + newFilename,
        Body: file.buffer,
        ACL: 'public-read',
        ContentType: mimetype,
        ContentDisposition: 'inline',
        CreateBucketConfiguration: {
          LocationConstraint: process.env.NEXTLENSE_AWS_REGION,
        },
      };

      const data = await this.s3.upload(params).promise();

      return data.Location;
    } catch (error) {
      console.error('Error during S3 upload:', error);
      throw new InternalServerErrorException('Failed to upload the file to S3');
    }
  }
}
