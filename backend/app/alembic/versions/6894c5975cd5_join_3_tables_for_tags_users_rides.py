"""Join 3 tables for tags users rides

Revision ID: 6894c5975cd5
Revises: abc4ccfa9c9c
Create Date: 2021-03-10 20:40:09.352601-08:00

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '6894c5975cd5'
down_revision = 'abc4ccfa9c9c'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('user_ride_tag',
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('ride_id', sa.Integer(), nullable=False),
    sa.Column('tag_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['ride_id'], ['ride.id'], ),
    sa.ForeignKeyConstraint(['tag_id'], ['tag.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['user.id'], ),
    sa.PrimaryKeyConstraint('user_id', 'ride_id', 'tag_id'),
    sa.UniqueConstraint('user_id', 'ride_id', 'tag_id')
    )
    op.drop_table('ride_tag')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('ride_tag',
    sa.Column('ride_id', sa.INTEGER(), autoincrement=False, nullable=False),
    sa.Column('tag_id', sa.INTEGER(), autoincrement=False, nullable=False),
    sa.Column('tag_count', sa.INTEGER(), autoincrement=False, nullable=True),
    sa.ForeignKeyConstraint(['ride_id'], ['ride.id'], name='ride_tag_ride_id_fkey'),
    sa.ForeignKeyConstraint(['tag_id'], ['tag.id'], name='ride_tag_tag_id_fkey'),
    sa.PrimaryKeyConstraint('ride_id', 'tag_id', name='ride_tag_pkey')
    )
    op.drop_table('user_ride_tag')
    # ### end Alembic commands ###