import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './HomePage.css';

const HomePage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero__content">
            <h1 className="hero__title">
              📚 Book Trading Club
            </h1>
            <p className="hero__subtitle">
              Teile deine Bücher, entdecke neue Geschichten und tausche mit Lesern aus der ganzen Welt!
            </p>
            <div className="hero__actions">
              {isAuthenticated ? (
                <>
                  <Link to="/books" className="btn btn-primary btn-lg">
                    Bücher entdecken
                  </Link>
                  <Link to="/add-book" className="btn btn-outline btn-lg">
                    Buch hinzufügen
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/register" className="btn btn-primary btn-lg">
                    Jetzt registrieren
                  </Link>
                  <Link to="/login" className="btn btn-outline btn-lg">
                    Login
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <h2 className="features__title">Wie funktioniert's?</h2>
          
          <div className="features__grid">
            {/* Feature 1 */}
            <div className="feature-card">
              <div className="feature-card__icon">📖</div>
              <h3 className="feature-card__title">Bücher hinzufügen</h3>
              <p className="feature-card__description">
                Füge deine Bücher zur Plattform hinzu und mache sie für andere sichtbar.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="feature-card">
              <div className="feature-card__icon">🔍</div>
              <h3 className="feature-card__title">Bücher entdecken</h3>
              <p className="feature-card__description">
                Durchsuche die Bibliothek anderer Mitglieder und finde spannende Bücher.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="feature-card">
              <div className="feature-card__icon">🔄</div>
              <h3 className="feature-card__title">Tausch-Anfragen</h3>
              <p className="feature-card__description">
                Sende Anfragen für Bücher die dich interessieren und tausche mit anderen.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="feature-card">
              <div className="feature-card__icon">👥</div>
              <h3 className="feature-card__title">Community</h3>
              <p className="feature-card__description">
                Vernetze dich mit anderen Bücherliebhabern und teile deine Leidenschaft.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats">
        <div className="container">
          <div className="stats__grid">
            <div className="stat">
              <div className="stat__value">📚</div>
              <div className="stat__label">Bücher zum Tauschen</div>
            </div>
            <div className="stat">
              <div className="stat__value">👥</div>
              <div className="stat__label">Aktive Mitglieder</div>
            </div>
            <div className="stat">
              <div className="stat__value">🔄</div>
              <div className="stat__label">Erfolgreiche Trades</div>
            </div>
            <div className="stat">
              <div className="stat__value">🌍</div>
              <div className="stat__label">Weltweit vernetzt</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!isAuthenticated && (
        <section className="cta">
          <div className="container">
            <div className="cta__content">
              <h2 className="cta__title">Bereit zum Tauschen?</h2>
              <p className="cta__text">
                Werde Teil unserer Community und entdecke die Freude am Büchertauschen!
              </p>
              <Link to="/register" className="btn btn-primary btn-lg">
                Kostenlos registrieren
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default HomePage;