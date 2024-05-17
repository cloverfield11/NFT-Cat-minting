$(document).ready(function() {
  $('.carousel').slick({
    dots: false,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 4000
  });

  var connectWalletButton = document.getElementById("connect-wallet");
  var walletAddressElement = document.getElementById("wallet-address");

  function updateUI() {
    if (typeof window.ethereum !== "undefined") {
      window.web3 = new Web3(window.ethereum);
      web3.eth.getAccounts(function(error, accounts) {
        if (error) {
          console.error(error);
          return;
        }

        if (accounts.length > 0) {
          var walletAddress = accounts[0];
          walletAddressElement.innerHTML = "Metamask connected";
          walletAddressElement.style.display = "block";
          connectWalletButton.style.display = "none";
        } else {
          walletAddressElement.style.display = "none";
          connectWalletButton.style.display = "block";
        }
      });
    } else {
      walletAddressElement.style.display = "none";
      connectWalletButton.style.display = "none";
    }
  }

  connectWalletButton.addEventListener("click", function() {
    if (typeof window.ethereum !== "undefined") {
      ethereum.enable().then(function(accounts) {
        updateUI();
      });
    }
  });

  updateUI();

  ethereum.on("accountsChanged", function(accounts) {
    updateUI();
  });
});
