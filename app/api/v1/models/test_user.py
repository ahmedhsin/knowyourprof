#!/usr/bin/python3
from app import db, BaseModel, User, UserSchema
import unittest
import sys
print(sys.path)
sys.path.append('/home/ahmed/knowyourprof/knowyourprof/')
schema = UserSchema()


class TestUser(unittest.TestCase):

    def test_emailvalidtion(self):
        user = User(email='blabla', name='tmp', password='tmp')
        ser = schema.dump(user)
        with self.assertRaises(ValidationError):
            des = schema.load(ser)


if __name__ == '__main__':
    unittest.main()
