import { userService } from "../../services";
import { errorHandlerWrapper } from "../../utils";
import { generateToken } from "../../utils/generate";
import { comparePassword } from "../../utils/password";
import httpStatus from "http-status";

const loginHandler = async (req, res) => {
  const { email, password } = req.body;

  const findUser = await userService.getOneUser({ email });

  if (!findUser)
    return res
      .json({ message: "Invalid Credentials", error: true })
      .status(httpStatus.NOT_FOUND);
  if (findUser.deletedAt)
    return res
      .json({ message: "User not found", error: true })
      .status(httpStatus.NOT_FOUND);
  const compare = await comparePassword(password, findUser.password);
  if (!compare)
    return res
      .json({ message: "Invalid Credentials", error: true })
      .status(httpStatus.BAD_REQUEST);
  const token = generateToken(findUser.uuid);
  res.json({ token }).status(httpStatus.ACCEPTED);
};

export const loginController = errorHandlerWrapper(loginHandler);
