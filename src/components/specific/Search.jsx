import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, TextField, InputAdornment, Stack, List, ListItem, ListItemText } from '@mui/material';
import { Search as SearchIcon } from "@mui/icons-material";
import { useInputValidation } from '6pp'; // Ensure this is correctly imported from your validation library
import UserItem from '../shared/UserItem';

import { useDispatch, useSelector } from 'react-redux';
import { setIsSearch } from '../../redux/reducers/misc';
import { useLazySearchUserQuery, useSendFriendRequestMutation } from '../../redux/api/api';

import { useAsyncMutation } from "../../hooks/hook";

const users=[1,2,3];

const Search = () => {
  const search = useInputValidation(''); // Initialize the search input state
  
  const [searchUser]=useLazySearchUserQuery();
  const [sendFriendRequest, isLoadingSendFriendRequest] = useAsyncMutation(
    useSendFriendRequestMutation
  );

  const addFriendHandler = async (id) => {
    await sendFriendRequest("Sending friend request...", { userId: id });
  };
  
  

  const{isSearch}=useSelector(state=>state.misc);
  const dispatch=useDispatch();

  const [users,setUsers]=useState([]);

  const searchCloseHandler =()=>{
   dispatch(setIsSearch(false));
  }

  useEffect(()=>{
    const timeOutId= setTimeout(()=>{
      searchUser(search.value)
      .then(({data})=>setUsers(data.users))
      .catch((e)=>console.log(e));

    },1000)
    return ()=>{
      clearTimeout(timeOutId);
    }

  },[search.value])

  return (
    <Dialog open={isSearch} onClose={searchCloseHandler} >
      <Stack p={"2rem"} direction={"column"} width={"25rem"}>
        <DialogTitle textAlign={"center"}>Find People</DialogTitle>
        <TextField
          placeholder="Search your Friends"
          value={search.value}
          onChange={search.changeHandler}
          variant="outlined"
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      <List >
      {
        users.map((i) => 
       <UserItem user={i} key={i._id} handler={addFriendHandler} handlerIsLoading={isLoadingSendFriendRequest}/>
       )
      }
      </List>



      </Stack>
    </Dialog>
  );
};

export default Search;
