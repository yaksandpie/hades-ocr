import React, { useEffect, useState } from 'react';
import { createWorker } from 'tesseract.js';
import boons from './boons';
import useCopyToClipboard from './useCopyToClipboard';


console.log(boons)

function App() {
  const [ocr, setOcr] = useState('select an image above');
  const [image, setImage] = useState();
  const [copy, isCopied] = useCopyToClipboard(1000);

  useEffect(() => {
    if (image) {
      const worker = createWorker({
        logger: ({ status, progress }) => setOcr(`${status} - ${Math.round(progress * 100)}%`),
      });

      const doOCR = async () => {
        await worker.load();
        await worker.loadLanguage('eng');
        await worker.initialize('eng');
        const { data: { text } } = await worker.recognize(URL.createObjectURL(image));
        setOcr(text);
      };

      doOCR();
    }
  }, [image]);

  return (
    <section className='wrapper'>
      <input
        id='file'
        type='file'
        className='visually-hidden'
        onChange={(e) => {
          setImage(e.target.files[0]);
        }}
      />

      <label htmlFor='file' className='box box-interactive'>Upload Security Report</label>
      {image && <p className='box'>currently selected: {image.name}</p>}

      <button className='results' onClick={() => copy(ocr)}>
        {ocr}
      </button>
      {isCopied && <p className='fadeIn box'>Copied.</p>}
    </section>
  );
}

export default App;
