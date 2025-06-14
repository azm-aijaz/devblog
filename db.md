| table_name | column_name     | data_type                | is_nullable |
| ---------- | --------------- | ------------------------ | ----------- |
| posts      | id              | uuid                     | NO          |
| posts      | title           | text                     | NO          |
| posts      | content         | text                     | NO          |
| posts      | topic_id        | uuid                     | NO          |
| posts      | cover_image_url | text                     | YES         |
| posts      | author_id       | uuid                     | NO          |
| posts      | created_at      | timestamp with time zone | NO          |
| posts      | updated_at      | timestamp with time zone | NO          |
| posts      | published       | boolean                  | YES         |
| posts      | slug            | text                     | NO          |
| posts      | read_time       | integer                  | YES         |
| posts      | view_count      | integer                  | YES         |
| posts      | excerpt         | text                     | YES         |
| posts      | like_count      | integer                  | YES         |
| profiles   | id              | uuid                     | NO          |
| profiles   | username        | text                     | YES         |
| profiles   | full_name       | text                     | YES         |
| profiles   | avatar_url      | text                     | YES         |
| profiles   | bio             | text                     | YES         |
| profiles   | website         | text                     | YES         |
| profiles   | social_links    | jsonb                    | YES         |
| profiles   | created_at      | timestamp with time zone | NO          |
| profiles   | updated_at      | timestamp with time zone | NO          |
| tags       | id              | uuid                     | NO          |
| tags       | name            | text                     | NO          |
| tags       | slug            | text                     | NO          |
| tags       | post_count      | integer                  | YES         |
| topics     | id              | uuid                     | NO          |
| topics     | name            | text                     | NO          |
| topics     | slug            | text                     | NO          |
| topics     | icon            | text                     | YES         |
| topics     | post_count      | integer                  | YES         |


| table_schema | constraint_name     | table_name | column_name | foreign_table_name | foreign_column_name |
| ------------ | ------------------- | ---------- | ----------- | ------------------ | ------------------- |
| public       | posts_topic_id_fkey | posts      | topic_id    | topics             | id                  |

