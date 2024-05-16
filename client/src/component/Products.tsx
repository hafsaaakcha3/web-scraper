import React, { useState } from 'react';

interface Product {
  link: string;
  name: string;
}

const Products: React.FC = () => {
  const [url, setUrl] = useState('');
  const [response, setResponse] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch(`http://4.233.16.88:4000/products?url=${url}`);
      if (!res.ok) { throw new Error('Failed to fetch data'); }
      const data: Product[] = await res.json();
      setResponse(data);
      console.log(data);
    } catch (error) {
      console.error('Error scraping URL:', error);
    } finally { setIsLoading(false) }
  };

  const handleDownload = () => {
    const currentDate = new Date();
    const timestamp = currentDate.toISOString().replace(/[:.]/g, '-');
    const filename = `products_${timestamp}.json`;

    const jsonBlob = new Blob([JSON.stringify(response)], { type: 'application/json' });
    const url = URL.createObjectURL(jsonBlob);

    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);

    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ margin: "20px" }}>
      <h3>Category Url</h3>

      <form onSubmit={handleSubmit}>
        <div className="input-group mb-3">
          <div className="input-group-prepend">
            <span className="input-group-text" >https://www.hollandandbarrett.com</span>
          </div>
          <input
            type="text"
            className="form-control"
            placeholder="Category link "
            aria-label="Paste Url here"
            aria-describedby="basic-addon2"
            onChange={(e) => {
              setUrl(e.target.value.replace('https://www.hollandandbarrett.com', ""))
            }}
            value={url}
          />
          <div className="input-group-append">
            <button
              className="btn btn-outline-secondary"
              type="submit"

            >Get Products</button>
          </div>
        </div>

      </form>


      {isLoading ? (
        <p>Loading...</p>
      ) : response.length > 0 ? (
        <>

          <div style={{ display: 'flex', justifyContent: 'space-between', margin: "20px" }}>
            <h1>Products List</h1>
            <button
              className="btn btn-outline-secondary"
              type="submit"
              onClick={() => handleDownload()}
            >Export as JSON</button>
          </div>
          <ul className="list-group">
            {response.map((e: Product, index) => (
              <li key={index} className="list-group-item" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <a href={"https://www.hollandandbarrett.com" + e.link} target="_blank">
                  {e.name}
                </a>
              </li>
            ))}
          </ul>
        </>
      ) : null}
    </div>

  );
};

export default Products;
