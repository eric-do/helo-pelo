"""Rename 'count' column due to existing method

Revision ID: abc4ccfa9c9c
Revises: 8b232013809d
Create Date: 2021-03-07 10:59:06.969572-08:00

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'abc4ccfa9c9c'
down_revision = '8b232013809d'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('ride_tag', sa.Column('tag_count', sa.Integer(), nullable=True))
    op.drop_column('ride_tag', 'count')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('ride_tag', sa.Column('count', sa.INTEGER(), autoincrement=False, nullable=True))
    op.drop_column('ride_tag', 'tag_count')
    # ### end Alembic commands ###