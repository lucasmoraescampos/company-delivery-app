export class Base64Helper {

    public static toBlob(dataURL: string, format: string) {

        const base64result = dataURL.substr(dataURL.indexOf(',') + 1);

        const byteString = window.atob(base64result);

        const arrayBuffer = new ArrayBuffer(byteString.length);

        const int8Array = new Uint8Array(arrayBuffer);

        for (let i = 0; i < byteString.length; i++) {
            int8Array[i] = byteString.charCodeAt(i);
        }

        const blob = new Blob([int8Array], { type: `image/${format}` });

        return blob;
    }
}