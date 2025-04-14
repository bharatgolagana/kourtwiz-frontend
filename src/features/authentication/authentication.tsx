import React, { useRef, useState, useEffect, useCallback } from 'react';
import Webcam from 'react-webcam';
import * as faceapi from 'face-api.js';
import { useSendImage } from '../../hooks/useSendImage';
import { useLocation } from 'react-router-dom';

const WebcamCapture: React.FC = () => {
    const location = useLocation();
    const clubId = location.state?.clubId || 'Unknown Club ID';
    const clubName = location.state?.clubName || 'Unknown Club';
    const webcamRef = useRef<Webcam>(null);

    const [modelsLoaded, setModelsLoaded] = useState(false);
    const [lowLightDetected, setLowLightDetected] = useState<boolean | null>(null);
    const [faceDetected, setFaceDetected] = useState(false);
    const [responseData, setResponseData] = useState<any>(null);
    const [processing, setProcessing] = useState(false);
    const [showWebcam, setShowWebcam] = useState(true);
    const [logs, setLogs] = useState<string[]>([]);

    const { mutate: sendImage, isPending } = useSendImage({
        onCompleteCallback: (data) => {
            console.log('📩 Response received:', data);
            setResponseData(data);
            setProcessing(false);
            setShowWebcam(false);

        },
        onErrorCallback: (error) => {
            console.error('🚨 Error occurred:', error.message);
            setResponseData({
                status: 'error',
                message: error.message
            });
            setProcessing(false);
            setShowWebcam(true);
            setLogs([]);
        },
        onMessageCallback: (data) => {
            if (typeof data.message === 'string') {
                setLogs((prevLogs) => [...prevLogs, `📡 ${data.message}`]);
            }
        },
    });

    const isPendingRef = useRef(isPending);
    useEffect(() => {
        isPendingRef.current = isPending;
    }, [isPending]);

    useEffect(() => {
        const loadModels = async () => {
            try {
                await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
                console.log('✅ Models loaded');
                setModelsLoaded(true);
            } catch (error) {
                console.error('❌ Failed to load models:', error);
            }
        };

        loadModels();
    }, []);

    const detectFaceAndLight = async () => {
        if (!webcamRef.current || isPendingRef.current || !modelsLoaded) return;

        const video = webcamRef.current.video;
        if (!video) return;

        const detections = await faceapi.detectAllFaces(
            video,
            new faceapi.TinyFaceDetectorOptions({ inputSize: 512, scoreThreshold: 0.5 })
        );

        setFaceDetected(detections.length > 0);

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imageData.data;
        let totalBrightness = 0;
        const pixelCount = pixels.length / 4;

        for (let i = 0; i < pixels.length; i += 4) {
            totalBrightness += 0.299 * pixels[i] + 0.587 * pixels[i + 1] + 0.114 * pixels[i + 2];
        }

        const avgBrightness = totalBrightness / pixelCount;
        setLowLightDetected(avgBrightness < 50);

        if (detections.length > 0 && avgBrightness >= 50 && !isPendingRef.current) {
            captureAndSendFromVideo(detections, video);
        }
    };

    useEffect(() => {
        if (!modelsLoaded || processing) return;

        const interval = setInterval(() => {
            detectFaceAndLight();
        }, 750);

        return () => clearInterval(interval);
    }, [modelsLoaded, processing]);

    const captureAndSendFromVideo = useCallback((detections: faceapi.FaceDetection[], video: HTMLVideoElement) => {
        if (!video) return;

        setProcessing(true);
        setShowWebcam(false);
        setLogs(['🔍 Face detected. Sending images...']);

        const capturedImages: string[] = [];

        detections.forEach((detection) => {
            let { x, y, width, height } = detection.box;
            const padding = 0.4;
            const newX = Math.max(0, x - width * padding);
            const newY = Math.max(0, y - height * padding);
            const newWidth = Math.min(video.videoWidth - newX, width * (1 + 2 * padding));
            const newHeight = Math.min(video.videoHeight - newY, height * (1 + 2 * padding));
            const faceCanvas = document.createElement('canvas');
            faceCanvas.width = newWidth;
            faceCanvas.height = newHeight;
            const faceCtx = faceCanvas.getContext('2d');
            y = Math.max(0, y - height * 0.3);
            if (faceCtx) {
                faceCtx.drawImage(video, newX, newY, newWidth, newHeight, 0, 0, newWidth, newHeight);
                const imageDataUrl = faceCanvas.toDataURL('image/jpeg');
                capturedImages.push(imageDataUrl);
            }
        });

        if (capturedImages.length > 0 && !isPendingRef.current) {
            sendImage({ images: capturedImages, clubName, clubId });
        }
    }, [sendImage, clubName, clubId]);

    return (
        <div style={{ textAlign: 'center' }}>
            {processing ? (
                <div>
                    <h3>PROCESSING...</h3>
                    <div style={{ textAlign: 'left', margin: '20px auto', maxWidth: '400px' }}>
                        <h4>📜 Logs:</h4>
                        <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
                            {logs.map((log, index) => (
                                <li key={index}>• {log}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            ) : responseData && responseData.status === 'error' ? (
                <div style={{ border: '2px solid red', padding: '20px', borderRadius: '10px', display: 'inline-block' }}>
                    <h4>❌ Error:</h4>
                    <p style={{ color: 'red' }}>{responseData.message}</p>
                </div>
            ) : responseData ? (
                <div style={{ border: '2px solid green', padding: '20px', borderRadius: '10px', display: 'inline-block' }}>
                    <h4>🔍 Detection Results:</h4>
                    <p>{responseData.message}</p>

                </div>
            ) : showWebcam ? (
                <div>
                    <h3>Align Your Face Inside the Box</h3>
                    <div style={{ position: 'relative', display: 'inline-block' }}>
                        <Webcam
                            ref={webcamRef}
                            audio={false}
                            screenshotFormat="image/jpeg"
                            style={{
                                borderRadius: '10px',
                                border: '2px solid gray',
                                width: '400px'
                            }}
                        />
                    </div>
                    <p>{faceDetected ? '✅ Face Detected' : '❌ No Face Detected'}</p>
                    <p>{lowLightDetected ? '⚠️ Low Light Detected' : '✅ Good Lighting'}</p>
                </div>
            ) : null}
        </div>
    );
};

export default WebcamCapture;
