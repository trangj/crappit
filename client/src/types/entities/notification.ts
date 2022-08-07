export interface Notification {
  id: number,
  recipient_id: number,
  sender_id: number,
  title: string,
  body: string,
  url: string,
  sent_at: Date,
  read_at: Date | null,
  icon_name: string,
  icon_url: string,
  notification_type: {
    type_name: string
  }
}
