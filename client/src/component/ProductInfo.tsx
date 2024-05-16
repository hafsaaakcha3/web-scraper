import React, { useState } from 'react';

interface ApiResponse {
    category: string;
    Manufacturer: string;
    name: string;
    images: string;
    price: string;
    description: string;
    ingredients: string;
    Nutritional: {
        [key: string]: {
            [key: string]: string;
        };
    };
}

const ProductInfo: React.FC = () => {
    const [link, setLink] = useState('');
    const [response, setResponse] = useState<ApiResponse | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLink(e.target.value.replace('https://www.hollandandbarrett.com', ""));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const apiUrl = `http://4.233.16.88:4000/product?url=${link}`;
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const data: ApiResponse = await response.json();
            setResponse(data);
            setError(null);
        } catch (error) {
            console.error('Error fetching data:', error);
            setError('Error fetching data. Please try again later.');
            setResponse(null);
        }
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
            <h3>Product URL</h3>
            <form onSubmit={handleSubmit}>
                <div className="input-group mb-3">
                    <div className="input-group-prepend">
                        <span className="input-group-text" >https://www.hollandandbarrett.com</span>
                    </div>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Product link"
                        aria-describedby="basic-addon2"
                        onChange={handleChange}
                        value={link}
                    />
                    <div className="input-group-append">
                        <button
                            className="btn btn-outline-secondary"
                            type="submit"
                        >Get Info</button>
                    </div>
                </div>
            </form>
            {error && <p>{error}</p>}
            {response && (
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', margin: "20px" }}>
                        <h2>Product Information </h2>
                        <button
                            className="btn btn-outline-secondary"
                            type="submit"
                            onClick={() => handleDownload()}
                        >Export as JSON</button>
                    </div>
                    <p><b>Category:</b> {response.category}</p>
                    <p><b>Manufacturer: </b>{response.Manufacturer}</p>
                    <p><b>Name: </b> {response.name}</p>
                    <p><b>Images: </b>{response.images}</p>
                    <p><b>Price:</b> {response.price}</p>
                    <p><b>Description:</b> {response.description}</p>
                    <p><b>Ingredients: </b>{response.ingredients}</p>
                    <h3>Nutritional Information:</h3>
                    <ul>
                        {Object.entries(response.Nutritional).map(([section, values]) => (
                            <li key={section}>
                                <h4>{section}</h4>
                                <ul>
                                    {Object.entries(values).map(([key, value]) => (
                                        <li key={`${section}-${key}`}>
                                            {`${key} : ${value}`}
                                        </li>
                                    ))}
                                </ul>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default ProductInfo;
