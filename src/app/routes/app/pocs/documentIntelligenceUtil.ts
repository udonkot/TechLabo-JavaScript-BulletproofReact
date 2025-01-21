import axios from "axios";

// sample documentIntelligence RESTAPI call
export const analyzeDocument = async (file: string) => {
    try {
        const response = await axios.post(
            'https://japaneast.api.cognitive.microsoft.com/formrecognizer/v2.0/prebuilt/invoice/analyze',
            {
                urlSource: "解析対象のファイルURLを指定"
            },
            {
                headers: {
                    'Ocp-Apim-Subscription-Key': 'APIキー',
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
            }
        );
        const operationLocation = response.headers['operation-location'];
        console.log('Operation-Location:', operationLocation);

        // // 解析結果を取得するための追加のリクエスト
        const resultResponse = await axios.get(operationLocation, {
            headers: {
                'Ocp-Apim-Subscription-Key': operationLocation,
            }
        });
        console.log(resultResponse.data);

    } catch (error) {
        console.error('Error analyzing document:', error);
    }
};
