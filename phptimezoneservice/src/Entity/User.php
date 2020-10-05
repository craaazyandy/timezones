<?php
 namespace App\Entity;
 use Doctrine\ORM\Mapping as ORM;
 use Symfony\Component\Validator\Constraints as Assert;
 /**
  * @ORM\Entity
  * @ORM\Table(name="user")
  * @ORM\HasLifecycleCallbacks()
  */
 class User implements \JsonSerializable {

  /** MODEL
   * @ORM\Column(type="integer")
   * @ORM\Id
   * @ORM\GeneratedValue(strategy="AUTO")
   */
  private $id;
  /**
   * @ORM\Column(type="string", length=100)
   *
   */
  private $email;
  /**
   * @ORM\Column(type="string", length=100)
   *
   */
  private $password;
  /** 
   * @ORM\Column(type="integer")
   * 
   */
  private $level;

  /** MODEL FUNCTIONS
   * @return mixed
   */
  public function getId()
  {
   return $this->id;
  }
  /**
   * @param mixed $id
   */
  public function setId($id)
  {
   $this->id = $id;
  }
  /**
   * @return mixed
   */
  public function getEmail()
  {
   return $this->email;
  }
  /**
   * @param mixed $email
   */
  public function setEmail($email)
  {
   $this->email = $email;
  }
  /**
   * @return mixed
   */
  public function getPasword()
  {
   return $this->password;
  }
  /**
   * @param mixed $password
   */
  public function setPassword($password)
  {
   $this->password = $password;
  }
  /**
   * @return mixed
   */
  public function getLevel()
  {
   return $this->level;
  }
  /**
   * @param mixed $level
   */
  public function setLevel($level)
  {
   $this->level = $level;
  }


  /**
   * Specify data which should be serialized to JSON
   * @link https://php.net/manual/en/jsonserializable.jsonserialize.php
   * @return mixed data which can be serialized by <b>json_encode</b>,
   * which is a value of any type other than a resource.
   * @since 5.4.0
   */
  public function jsonSerialize()
  {
   return [
    "email" => $this->getEmail(),
    "level" => $this->getLevel()
   ];
  }
 }