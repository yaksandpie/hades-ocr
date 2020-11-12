import React, { useEffect, useState } from 'react';
import { createWorker } from 'tesseract.js';
import boons from './boons';


function App() {
  const [ocr, setOcr] = useState();
  const [image, setImage] = useState();

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

  console.log(boons)

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

      <label htmlFor='file' className='box box-interactive'>Find Security Report</label>
      {image && <p className='box'>currently selected: {image.name}</p>}

      <div className='results'>
        <textarea value={ocr} readOnly placeholder='select an image above' />
      </div>
    </section>
  );
}

export default App;
