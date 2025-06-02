import React, { useCallback, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import cn from 'classnames';
import debounce from 'lodash.debounce';
import { Person } from './types/Person';

const delay = 300;

const preparedVisiblePeople = (people: Person[], appliedQuery: string) => {
  const visiblePeople = [...people];
  const normalizedQuery = appliedQuery.trim().toLowerCase();

  if (appliedQuery) {
    return visiblePeople.filter(person =>
      person.name.toLowerCase().includes(normalizedQuery),
    );
  }

  return visiblePeople;
};

export const App: React.FC = () => {
  // const { name, born, died } = peopleFromServer[0];

  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [isFocus, setIsFocus] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const applyOuery = useCallback(debounce(setAppliedQuery, delay), []);

  const handleQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value.trimStart());
    applyOuery(event.target.value.trimStart());
    setSelectedPerson(null);
  };

  const visiblePeople = preparedVisiblePeople(peopleFromServer, appliedQuery);

  const handleSelectedPerson = (person: Person) => {
    setSelectedPerson(person);
    setIsFocus(false);
  };

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPerson
            ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
            : 'No selected person'}
        </h1>

        <div className={cn({ 'dropdown is-active': isFocus })}>
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder={
                selectedPerson
                  ? selectedPerson.name
                  : 'Enter a part of the name'
              }
              className="input"
              data-cy="search-input"
              value={query}
              onChange={handleQuery}
              onFocus={() => setIsFocus(true)}
            />
          </div>

          <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
            <div className="dropdown-content">
              {visiblePeople.length > 0 ? (
                visiblePeople.map(person => (
                  <div
                    key={person.slug}
                    className="dropdown-item"
                    data-cy="suggestion-item"
                    onClick={() => handleSelectedPerson(person)}
                  >
                    <p
                      className={cn({
                        'has-text-link': person.sex === 'm',
                        'has-text-danger': person.sex === 'f',
                      })}
                    >
                      {person.name}
                    </p>
                  </div>
                ))
              ) : (
                <div
                  className="
                  notification
                  is-danger
                  is-light
                  mt-3
                  is-align-self-flex-start
                "
                  role="alert"
                  data-cy="no-suggestions-message"
                >
                  <p className="has-text-danger">No matching suggestions</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
