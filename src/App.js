import React, { useEffect, useState } from 'react';
import { createWorker } from 'tesseract.js';
import boons from './boons';
import useCopyToClipboard from './useCopyToClipboard';

console.log(boons)

function App() {
  const [ocr, setOcr] = useState(undefined);
  const [image, setImage] = useState();
  const [twitter, setTwitter] = useState();
  const [copy, isCopied] = useCopyToClipboard(1000);

  useEffect(() => {
    if (twitter) {
      const script = document.createElement('script');
      script.src = 'https://platform.twitter.com/widgets.js';
      document.body.appendChild(script);
    }
  }, [twitter]);

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

      {image && <p className='📦'>currently selected: {image.name}</p>}

      {
        ocr &&
        <button className='results' onClick={() => copy(ocr)}>
          {ocr}
        </button>
      }

      <label htmlFor='file' className='🍑on'>Upload Security Report</label>
      {isCopied && <p className='fadeIn box'>Copied.</p>}

      <marquee>or</marquee>

      <form onSubmit={(e) => {
        e.preventDefault();
        setTwitter(e.target.username.value);
      }}>
        <input className='twitter-input' type='text' name='username' placeholder="Twitter handle..." />
        <button className='🍑on'>Load Twitter Account</button>
      </form>

      {twitter && (
        <div className='twitterStream'>
          <a className='twitter-timeline' href={`https://twitter.com/${twitter}?ref_src=twsrc%5Etfw`}>{twitter}</a>
        </div>
      )}
    </section>
  );
}

export default App;
