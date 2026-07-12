import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '5s', target: 20 },
    { duration: '15s', target: 100 },
    { duration: '5s', target: 0 },
  ],
};

export default function () {
  const res = http.get('http://localhost:3000/users/1');
  
  check(res, {
    'status is 200': (r) => r.status === 200,
    'transaction time < 15ms': (r) => r.timings.duration < 15,
  });

  sleep(0.1);
}