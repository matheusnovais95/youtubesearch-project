const request = require('supertest');
const app = require('../server');

describe('BFF Endpoints', () => {
  it('should fetch videos from YouTube API', async () => {
    const response = await request(app).get('/videos?q=test');
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });

  it('should add a video to favorites', async () => {
    const video = { id: { videoId: 'test' }, snippet: { title: 'Test Video' } };
    const response = await request(app)
      .post('/favorites')
      .send(video)
      .set('Accept', 'application/json');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expect.arrayContaining([video]));
  });

  it('should delete a video from favorites', async () => {
    const video = { id: { videoId: 'test' }, snippet: { title: 'Test Video' } };
    await request(app).post('/favorites').send(video).set('Accept', 'application/json');

    const response = await request(app)
      .delete('/favorites/test')
      .set('Accept', 'application/json');
    expect(response.statusCode).toBe(200);
    expect(response.body).not.toEqual(expect.arrayContaining([video]));
  });
});
