// When the admin login stops accepting passcode attempts.
//
// Failed attempts are counted in fixed 15-minute windows, both per IP address
// and across all IPs. A per-IP limit stops one attacker cold but is bypassed by
// rotating IPs; a global limit stops distributed guessing, but anyone can then
// trip it on purpose and lock the real owner out until the window ends.

export const LOGIN_WINDOW_SEC = 15 * 60;

/**
 * Returns true when the next attempt should be refused before the passcode is
 * even checked.
 *
 * @param ipFailures     attempts from this IP in the current window (a
 *                       successful login clears it)
 * @param globalFailures attempts from every IP in the current window, counting
 *                       only those inside their IP's limit; successful logins
 *                       stay in this count until the window ends
 */
export function loginLocked(ipFailures: number, globalFailures: number): boolean {
  // TODO(you): conservative placeholder; see the trade-off above.
  return ipFailures >= 5 || globalFailures >= 30;
}
