import React from 'react';
import { Link } from 'react-router-dom';
import { ErrorBoundary } from '../ui/ErrorBoundary';

export const Header = () => {
    return (
        <ErrorBoundary>
            <header>
                <div>
                    <Link to="/"><button>Home</button></Link>
                    &nbsp;
                        <Link to="/counter"><button>Counter page</button></Link>
                    &nbsp;
                        <Link to="/starwars"><button>StarWars page</button></Link>
                    &nbsp;
                        <Link to="/ampstories"><button>AMP Stories page</button></Link>
                    &nbsp;
                        <Link to="/user-settings-f7977542-cf72-439d-897f-8c61e0c36dc6"><button>User settings page</button></Link>
                </div>
                <div>
                    I'm a header
                    </div>
                <hr />
            </header>
        </ErrorBoundary>
    );
};
