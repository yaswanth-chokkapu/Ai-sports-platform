/**
 * Session utility functions for AthleteX.
 * Authoritative ordering, filtering, and selection for chart visualizations.
 */

/**
 * Extracts a numeric timestamp from a session, falling back to parsed date/time
 * or preserving original array insertion order.
 *
 * @param {Object} session
 * @param {number} fallbackIndex
 * @returns {number}
 */
export function getSessionTimestamp(session, fallbackIndex = 0) {
  if (typeof session?.timestamp === "number" && !isNaN(session.timestamp)) {
    return session.timestamp;
  }
  if (typeof session?.date === "string") {
    const dateStr = session.time ? `${session.date} ${session.time}` : session.date;
    const parsed = Date.parse(dateStr);
    if (!isNaN(parsed)) return parsed;
  }
  return fallbackIndex;
}

/**
 * Validates that an object is a genuine performance session record
 * with a valid numeric overall_score.
 *
 * @param {any} session
 * @returns {boolean}
 */
export function isValidPerformanceSession(session) {
  return (
    session !== null &&
    typeof session === "object" &&
    typeof session.overall_score === "number" &&
    !isNaN(session.overall_score)
  );
}

/**
 * Returns all valid performance sessions sorted in chronological order (oldest to newest),
 * each annotated with its authoritative 1-based chronological sessionNumber (1..N).
 *
 * @param {Array} sessions
 * @returns {Array}
 */
export function getOrderedValidSessions(sessions) {
  if (!Array.isArray(sessions) || sessions.length === 0) return [];

  const indexed = sessions
    .map((session, originalIndex) => ({ session, originalIndex }))
    .filter(({ session }) => isValidPerformanceSession(session));

  indexed.sort((a, b) => {
    const tA = getSessionTimestamp(a.session, a.originalIndex);
    const tB = getSessionTimestamp(b.session, b.originalIndex);
    if (tA !== tB) return tA - tB;
    return a.originalIndex - b.originalIndex;
  });

  return indexed.map(({ session }, idx) => ({
    ...session,
    sessionNumber: idx + 1,
  }));
}

/**
 * Returns at most the latest `limit` valid performance sessions (default 7),
 * ordered from oldest to newest within that selected window.
 *
 * Preserves the true session numbers (e.g. 20 total sessions -> sessions 14–20).
 *
 * @param {Array} sessions
 * @param {number} limit
 * @returns {Array}
 */
export function getLatestSessions(sessions, limit = 7) {
  const ordered = getOrderedValidSessions(sessions);
  if (ordered.length === 0) return [];
  return ordered.slice(-limit);
}
