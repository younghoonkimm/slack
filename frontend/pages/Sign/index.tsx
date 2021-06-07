import React, { useCallback, useState } from "react";
import { Redirect, Link } from "react-router-dom";
import axios from "axios";
import useSWR, { mutate } from "swr";

import useInput from "@hooks/useInput";
import { Button, Error, Form, Header, Input, Label, LinkContainer, Success } from "@pages/Sign/styles";
import fetcher from "@utils/fetcher";

const SignUp = () => {
  const { data: userData, mutate } = useSWR("/api/users", fetcher);
  const [signUpError, setSignUpError] = useState(false);
  const [signUpSuccess, setSignUpSuccess] = useState(false);
  const [mismatchError, setMismatchError] = useState(false);
  const [email, onChangeEmail] = useInput("");
  const [nickname, onChangeNickname] = useInput("");
  const [password, , setPassword] = useInput("");
  const [passwordCheck, , setPasswordCheck] = useInput("");

  const onChangePassword = useCallback(
    (e) => {
      setPassword(e.target.value);
      setMismatchError(passwordCheck !== e.target.value);
    },
    [passwordCheck],
  );

  const onChangePasswordCheck = useCallback(
    (e) => {
      setPasswordCheck(e.target.value);
      setMismatchError(password !== e.target.value);
    },
    [password],
  );

  const onSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (!nickname || !nickname.trim()) {
        return;
      }
      console.log(nickname, email, password);
      if (!mismatchError && nickname) {
        console.log("서버로 회원가입하기");
        axios
          .post("http://localhost:3095/api/users", {
            email,
            nickname,
            password,
          })
          .then((response) => {
            mutate(response.data, false);
          })
          .catch((error) => {
            console.log(error.response);
          })
          .finally(() => {});
      }
      // if (!mismatchError) {
      //   setSignUpError(false);
      //   setSignUpSuccess(false);
      //   axios
      //     .post("/api/users", { email, nickname, password })
      //     .then(() => {
      //       setSignUpSuccess(true);
      //     })
      //     .catch((error) => {
      //       setSignUpError(error.response?.data?.statusCode === 403);
      //     });
      // }
    },
    [email, nickname, password, passwordCheck, mismatchError],
  );

  if (userData) {
    return <Redirect to="/workspace/slack/channel/일반" />;
  }

  return (
    <div id="container">
      <Header>Slack</Header>
      <Form onSubmit={onSubmit}>
        <Label id="email-label">
          <span>이메일 주소</span>
          <div>
            <Input type="email" id="email" name="email" value={email} onChange={onChangeEmail} />
          </div>
        </Label>
        <Label id="nickname-label">
          <span>닉네임</span>
          <div>
            <Input type="text" id="nickname" name="nickname" value={nickname} onChange={onChangeNickname} />
          </div>
        </Label>
        <Label id="password-label">
          <span>비밀번호</span>
          <div>
            <Input type="password" id="password" name="password" value={password} onChange={onChangePassword} />
          </div>
        </Label>
        <Label id="password-check-label">
          <span>비밀번호 확인</span>
          <div>
            <Input
              type="password"
              id="password-check"
              name="password-check"
              value={passwordCheck}
              onChange={onChangePasswordCheck}
            />
          </div>
          {mismatchError && <Error>비밀번호가 일치하지 않습니다.</Error>}
          {!nickname && <Error>닉네임을 입력해주세요.</Error>}
          {signUpError && <Error>이미 가입된 이메일입니다.</Error>}
          {signUpSuccess && <Success>회원가입되었습니다! 로그인해주세요.</Success>}
        </Label>
        <Button type="submit">회원가입</Button>
      </Form>
      <LinkContainer>
        이미 회원이신가요?&nbsp;
        <Link to="/login">로그인 하러가기</Link>
      </LinkContainer>
    </div>
  );
};

export default SignUp;
