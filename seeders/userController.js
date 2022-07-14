const User = require('../models').user
const {successWithData, verifyPassword, hashPassword, getPagination , getPagingData} = require('../helper/helper')
const jwt = require('jsonwebtoken')
const errorHandler = require('../helper/errorHandler')

// GET ALL USER
// async function getAllUser(req, res, next) {
//     try {
//         const allUser = await User.findAll({
//             order:[['name', 'asc']]
//         })

//     res.status(200).json(respons.successWithData('SUCCESS', allUser))
//     } catch (error) {
//         next(error)
//     }
// }

//GET USER LIST
async function getListUser (req, res, next) {
    try {
        const {pageNumber, pageSize} = req.body
        const {limit, offset} = getPagination(pageNumber, pageSize)
        const listUser = await User.findAndCountAll({
            limit: limit,
            offset: offset,
            order: [['created_at', 'asc']]
        })

        const responseData = getPagingData(listUser, pageNumber, limit)

        res.status(200).json(successWithData('SUCCESS', responseData ))

    } catch (error) {
        next(error)
    }
}


// GET USER BY ID
async function getUserById(req, res, next) {
    const id = req.user.user_id
    try {
        const userData = await User.findByPk(id)

        const token = jwt.sign(
            {
              user_id: userData.user_id,
              name: userData.name,
              email: userData.email
            },
            process.env.JWT_SECRET
          );

        if (!userData) {
            throw new errorHandler(404, "User Not Found")
        } else {
            res.status(200).json({
                message: "SUCCESS",
                data: userData,
                redux: {
                    user_id: userData.user_id,
                    name: userData.name,
                    email: userData.email,
                    token: token
                }
            })
        }
    } catch (error) {
        console.log(error)
        next(error)
    }
}

// EDIT USER
async function editUser(req, res, next) {
    const id= req.user.user_id
    try {
        const userToEdit = await User.findByPk(id)

        if(!userToEdit) throw new errorHandler(404, "User Not Found")

        const {
            name,
            email,
            password1,
            password2
        } = req.body

        if(password1 != password2) throw new errorHandler(400, "Password Not Match!!")

      const editData = {}
    
      if(name) {
          editData.name = name
      }
      if(email) {
          editData.email = email
      }
      if(password1 && password2) {
          editData.password = await hashPassword(password1)
      }

      await userToEdit.update(editData)

      res.status(200).json(successWithData('SUCCESS', userToEdit))

    } catch (error) {
        console.log(error)
        next(error)
    }
}

//DELETE USER
async function deleteUser (req, res , next) {
    const id = req.params.id
    try {
        const userData = await User.findByPk(id)

        if(!userData) {
            throw new errorHandler(404, 'User Not Found')
        }
        
        await userData.destroy()
        
    } catch (error) {
        next(error)
    }
}

// SIGNUP
async function signup(req, res, next) {
  try {
      const {
          name,
          email,
          password,
      } = req.body

      if(!name) throw new errorHandler(400, "Please Input Name!")
      if(!email) throw new errorHandler(400, "Plase Input Email!")
      if(!password) throw new errorHandler(400, "Please Input Password")

      const newUser = await User.create({
          name: name,
          email: email.toLowerCase(),
          password: await hashPassword(password)
      })        

      if (newUser) {
          return res.status(200).json(successWithData('SUCCESS', newUser))
      } else {
          res.status(400).json("User Faild to Create!")
      }
  } catch (error) {
    console.log(error)
      next(error)
  }
}

// LOGIN FOR USER
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email) {
      throw new errorHandler(400, "Please input email!!");
    }
    if (!password) {
      throw new errorHandler(400, "Please input password!!");
    }

    const userData = await User.findOne({
      where: {
        email: email.toLowerCase()
      }
    });

    if (!userData) {
      throw new errorHandler(404, "Your Email Is Not Registered");
    }

    const correctPassword = await verifyPassword(password, userData.password);

    if (!correctPassword) {
      throw new errorHandler(403, "Wrong Password");
    } else {
      const token = jwt.sign(
        {
          user_id: userData.user_id,
          name: userData.name,
          email: userData.email
        },
        process.env.JWT_SECRET
      );

      res.json({
        message: "SUCCESS",
        data: {
          user_id: userData.user_id,
          name: userData.name,
          email: userData.email,
          token: token
        },
      });
    }
  } catch (error) {
    console.log(error)
    next(error);
  }
};


module.exports = {
    getUserById,
    getListUser,
    editUser,
    deleteUser,
    login,
    signup
}