"""Add username to User, normalize tag count, set created_at to be auto

Revision ID: 9626dc91cb40
Revises: f1c3347c3894
Create Date: 2021-03-02 21:41:14.362021-08:00

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '9626dc91cb40'
down_revision = 'f1c3347c3894'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('tag', 'count')
    op.add_column('user', sa.Column('username', sa.String(), nullable=True))
    op.drop_column('user', 'first_name')
    op.drop_column('user', 'last_name')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('user', sa.Column('last_name', sa.VARCHAR(length=100), autoincrement=False, nullable=True))
    op.add_column('user', sa.Column('first_name', sa.VARCHAR(length=100), autoincrement=False, nullable=True))
    op.drop_column('user', 'username')
    op.add_column('tag', sa.Column('count', sa.INTEGER(), autoincrement=False, nullable=True))
    # ### end Alembic commands ###
