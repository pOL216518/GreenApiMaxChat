import styles from './EmptyState.module.css';

export function EmptyState() {
  return (
    <section className={styles.empty}>
      <p>Выберите чат или создайте новый по номеру телефона</p>
    </section>
  );
}
