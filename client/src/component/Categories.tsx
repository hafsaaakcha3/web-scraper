import React, { useState, useEffect } from 'react';

interface Category {
    name: string;
    link: string;
}

const Categories: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [useCashe, setUseCashe] = useState<boolean>(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const apiUrl = `http://4.233.16.88:4000/categories?usecashe=${useCashe}`;
                const response = await fetch(apiUrl);

                if (!response.ok) { throw new Error('Failed to fetch data') }
                const data: Category[] = await response.json();
                setCategories(data);
                console.log(data)
            } catch (error) {
                console.error('Error fetching category data:', error);
            }
        };

        fetchData();
    }, []);

    const handleDownload = () => {
        const currentDate = new Date();
        const timestamp = currentDate.toISOString().replace(/[:.]/g, '-');
        const filename = `products_${timestamp}.json`;

        const jsonBlob = new Blob([JSON.stringify(categories)], { type: 'application/json' });
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
            <div style={{ display: 'flex', justifyContent: 'space-between', margin: "20px 0" }}>
                <h1>Category List</h1>
                <div style={{ margin: "10px" }}>
                    <input
                        type='checkbox'
                        checked={useCashe}
                        onChange={() => setUseCashe(!useCashe)}
                    />Use cashe in Refresh
                </div>
                <div>
                    <button
                        className="btn btn-outline-secondary"
                        type="submit"
                        onClick={() => handleDownload()}
                    >Export as JSON</button>
                </div>
            </div>
            <ul className="list-group">
                {categories.map((category, key) => (
                    <li key={key} className="list-group-item">
                        <a key={key} href={category.link} target='_blank'>{category.name}</a>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Categories;
