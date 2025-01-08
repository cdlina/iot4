const express = require('express');
const WebSocket = require('ws');
const { exec } = require('child_process');
const path = require('path');

const app = express();
const port = 3000;

// WebSocket 서버 설정
const wss = new WebSocket.Server({ noServer: true });

// 초기 온도 범위 설정
let minTemp = 5;
let maxTemp = 30;

// WebSocket 연결 처리
wss.on('connection', (ws) => {
    console.log('Client connected');

    // 주기적으로 DHT11 센서 데이터 읽기
    const interval = setInterval(() => {
        console.log('Reading DHT11 data...');
        exec('/home/admin/myenv/bin/python3 /home/admin/iot3/scripts/read_dht11.py', (err, stdout, stderr) => {
            if (err) {
                console.error(`Error reading DHT11 data: ${err}`);
                return;
            }
            if (stderr) {
                console.error(`DHT11 stderr: ${stderr}`);
                return;
            }

            console.log(`DHT11 Data: ${stdout}`);
            try {
                const data = JSON.parse(stdout);
                const temperature = data.temperature;
                const humidity = data.humidity;

                // 자동 모드에서 보일러 및 환풍기 제어
                if (temperature < minTemp) {
                    console.log(`Temperature ${temperature}°C below ${minTemp}°C. Turning Boiler ON...`);
                    exec('/home/admin/myenv/bin/python3 /home/admin/iot3/scripts/ledon.py', (err, stdout, stderr) => {
                        if (err) {
                            console.error(`Error controlling boiler: ${err}`);
                        } else {
                            console.log(`Boiler Control Output: ${stdout}`);
                        }
                    });
                } else if (temperature >= minTemp) {
                    console.log(`Temperature ${temperature}°C above ${minTemp}°C. Turning Boiler OFF...`);
                    exec('/home/admin/myenv/bin/python3 /home/admin/iot3/scripts/ledoff.py', (err, stdout, stderr) => {
                        if (err) {
                            console.error(`Error controlling boiler: ${err}`);
                        } else {
                            console.log(`Boiler Control Output: ${stdout}`);
                        }
                    });
                }

                // 환풍기 제어
                if (temperature > maxTemp) {
                    console.log(`Temperature ${temperature}°C above ${maxTemp}°C. Turning FAN ON...`);
                    exec('/home/admin/myenv/bin/python3 /home/admin/iot3/scripts/fanon.py', (err, stdout, stderr) => {
                        if (err) {
                            console.error(`Error controlling FAN: ${err}`);
                        } else {
                            console.log(`FAN Control Output: ${stdout}`);
                        }
                    });
                } else if (temperature <= maxTemp) {
                    console.log(`Temperature ${temperature}°C below ${maxTemp}°C. Turning FAN OFF...`);
                    exec('/home/admin/myenv/bin/python3 /home/admin/iot3/scripts/fanoff.py', (err, stdout, stderr) => {
                        if (err) {
                            console.error(`Error controlling FAN: ${err}`);
                        } else {
                            console.log(`FAN Control Output: ${stdout}`);
                        }
                    });
                }

                // 클라이언트로 온도/습도 데이터 전송
                ws.send(JSON.stringify({ temperature, humidity }));
            } catch (parseError) {
                console.error(`Error parsing DHT11 data: ${parseError}`);
            }
        });
    }, 5000); // 5초마다 센서 데이터 읽기

    // 클라이언트로부터 메시지 받기
    ws.on('message', (message) => {
        console.log('Received message from client:', message);

        // 메시지를 문자열로 변환
        const messageString = message.toString().trim(); // 공백 제거
        console.log('Processed message:', messageString);

        try {
            const parts = messageString.split(':');
            const command = parts[0];

            if (command === 'auto_mode' && parts.length === 3) {
                minTemp = parseFloat(parts[1]);
                maxTemp = parseFloat(parts[2]);
                console.log(`Auto mode set with range: ${minTemp} - ${maxTemp}`);
            } else if (command === 'boiler_on') {
                controlBoiler('켜기');
            } else if (command === 'boiler_off') {
                controlBoiler('끄기');
            } else if (command === 'fan_on') {
                controlFan('켜기');
            } else if (command === 'fan_off') {
                controlFan('끄기');
            } else {
                console.error('Invalid command format or unknown command.');
            }
        } catch (err) {
            console.error('Error processing message:', err);
        }
    });

    // 연결 종료 시 interval 클리어
    ws.on('close', () => {
        console.log('Client disconnected');
        clearInterval(interval);
    });
});

// Express로 정적 파일 제공
app.use(express.static(path.join(__dirname, 'public')));

// HTTP 서버와 WebSocket 서버 결합
const server = app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

server.on('upgrade', (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
    });
});
//test