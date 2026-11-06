import type { Ticket, User } from '@/types';

export function belongsToUser(
  ticket: Ticket,
  user?: Pick<User, 'name' | 'email'>,
  fallbackName?: string,
): boolean {
  const userEmail = user?.email?.trim().toLowerCase() || '';

  const requesterEmail =
    ticket.requesterEmail?.trim().toLowerCase() || '';

  const contact = ticket.requesterContact?.trim().toLowerCase() || '';

  const ticketEmail = requesterEmail || (contact.includes('@') ? contact : '');

  // Quando existe e-mail no chamado, ele é o identificador prioritário.
  if (ticketEmail) {
    return Boolean(userEmail && ticketEmail === userEmail);
  }

  // Chamados antigos sem e-mail: usar o nome como alternativa.
  const requesterName = ticket.requesterName?.trim().toLowerCase() || '';
  const currentName = (user?.name || fallbackName || '').trim().toLowerCase();

  return Boolean(requesterName && currentName && requesterName === currentName);
}
