import { useState, useEffect } from 'react';
import axios from 'axios';

const SearchBar = () => {
    const [query, setQuery] = useState('');
    const [result, setResult] = useState([]);
    const [resultCast, setResultCast] = useState([]);
    const [selectedShowId, setSelectedShowId] = useState(null);

    const debounce = (cb, delay) => {
        let timeoutId;

        return function (...args) {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }

            timeoutId = setTimeout(() => {
                cb(...args);
            }, delay);
        };
    };

    const fetchData = debounce((queryPar) => {
        const response = axios.get(
            `https://api.tvmaze.com/search/shows?q=${queryPar}`
        );

        response.then((res) => {
            console.log(res.data);
            setResult(res.data);
        });
    }, 1000);

    function fetchCastImage(id) {
        setSelectedShowId(id);

        const response = axios.get(
            `https://api.tvmaze.com/shows/${id}/cast`
        );

        response.then((res) => {
            console.log(res.data);
            setResultCast(res.data);
        });
    }

    useEffect(() => {
        fetchData(query);
    }, [query, fetchData]);

    return (
        <div>
            <input
                type="text"
                placeholder="Search..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />

            {result.length > 0 && (
                <div>
                    {result.map((item) => {
                        return (
                            <div key={item.show.id}>
                                <h2 onClick={() => fetchCastImage(item.show.id)}>
                                    {item.show.name}
                                </h2>

                                {selectedShowId === item.show.id &&
                                    resultCast.length > 0 && (
                                        <div style={{ display: 'flex' }}>
                                            {resultCast.map((castItem) => {
                                                return (
                                                    <div key={castItem.character.id}>
                                                        <img
                                                            src={castItem.person.image?.medium}
                                                            alt={castItem.person.name}
                                                        />
                                                        <p>{castItem.person.name}</p>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default SearchBar;