import { BaseQueue } from '@service/queues/base.queue';
import { imageWorker } from '@worker/image.worker';
import { IFileImageJobData } from '@image/interfaces/image.interface';

class ImageQueue extends BaseQueue {
  constructor() {
    super('iamges');
    this.processJob('addUserProfileImageToDB', 5, imageWorker.addUserProfileImageToDB);
    this.processJob('updateBGImageInDB', 5, imageWorker.updateBGImageInDB);
    this.processJob('addImageToDB', 5, imageWorker.addImageToDB);
    this.processJob('removeImageFromDB', 5, imageWorker.removeImageFromDB);
  }

  public addImageJob(name: string, data: IFileImageJobData): void {
    this.addJob(name, data);
  }
}

export const imageQueue: ImageQueue = new ImageQueue();
