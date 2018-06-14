module.exports = {

  sic:{
    version:'1.0.0',
    api:{
      error:{
        unknown:500,
        sms:{
          code_timeout:50001001,
          code_error:50001005,
          phone_number_err:50001010,
          sms_permit:50001015,
        }
      }
    },
    chain:{
      newaccount:{
        ram: {
          bytes:4096,
          eos:'0.0001 SIS'
        },
        net: {
          quantity: '0.0001 SIS',
        },
        cpu: {
          quantity: '0.0001 SIS',
        },
      }
    },
    file:{
      auth:{
        expires: 3600,//auth file an hour
      }
    },
    sms:{
      sign:'SIC',
      code:{
        tplCode:'135170163',//default sms tpl
        seconds:300,//cached code 300 seconds
      }
    },
    token:{
      reward:{
        reject:-1,
        undo:0,
        fin:1
      },
      deposit:{
        reject:-1,
        undo:0,
        fin:1
      }
    },
    contract:{
      policy:{
        code: 'sic.policy',
        account : 'sic.policy',
        user    : 'sic.policy',
        action  : {
          unapproved:'unapproved'
        },
        table :{
          policy:'policy'
        },
        status:{
          upload:0,
          reviewing:10,
          approved:20,
          disapprove:30
        }
      },
      token:{
        code:'sic.token',
        action :{
          withdraw:'withdraw'
        },
        table:{
          account:'account',
        }
      },
      account:{
        code:'account.info',
        action:{
          setphone:'setphone',
          setemail:'setemail'
        },
        table:{
          accountinfo:'accountinfo'
        }
      }
    }
  }
};
